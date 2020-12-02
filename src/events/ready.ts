import {
  ActivityType,
  bgBlue,
  bgYellow,
  black,
  cache,
  editBotsStatus,
  fetchMembers,
  StatusTypes,
} from "../../deps.ts";
import { botCache } from "../../cache.ts";
import { configs } from "../../configs.ts";
import { getTime } from "../utils/helpers.ts";
import { db } from "../database/database.ts";

botCache.eventHandlers.ready = async function () {
  editBotsStatus(
    StatusTypes.DoNotDisturb,
    "Discordeno Best Lib",
    ActivityType.Game,
  );

  console.info(`Loaded ${botCache.arguments.size} Argument(s)`);
  console.info(`Loaded ${botCache.commands.size} Command(s)`);
  console.info(`Loaded ${Object.keys(botCache.eventHandlers).length} Event(s)`);
  console.info(`Loaded ${botCache.inhibitors.size} Inhibitor(s)`);
  console.info(`Loaded ${botCache.monitors.size} Monitor(s)`);
  console.info(`Loaded ${botCache.tasks.size} Task(s)`);

  botCache.tasks.forEach((task) => {
    // Load the missions when the bot is started
    if (task.name === "mission") task.execute();

    setTimeout(() => {
      console.log(
        `${bgBlue(`[${getTime()}]`)} => [TASK: ${
          bgYellow(black(task.name))
        }] Started.`,
      );
      task.execute();

      setInterval(() => {
        console.log(
          `${bgBlue(`[${getTime()}]`)} => [TASK: ${
            bgYellow(black(task.name))
          }] Started.`,
        );
        task.execute();
      }, task.interval);
    }, Date.now() % task.interval);
  });

  console.info(`Loading Cached Settings:`);

  const guildSettings = await db.guilds.findMany({}, true);
  const mirrors = await db.mirrors.findMany({}, true);
  const blacklisted = await db.blacklisted.findMany({}, true);
  const spyRecords = await db.spy.findMany({}, true);

  for (const settings of guildSettings) {
    if (settings.prefix !== configs.prefix) {
      botCache.guildPrefixes.set(settings.guildID, settings.prefix);
    }
    if (settings.language !== "en_US") {
      botCache.guildLanguages.set(settings.guildID, settings.language);
    }
    if (settings.autoembedChannelIDs) {
      settings.autoembedChannelIDs.forEach((id) =>
        botCache.autoEmbedChannelIDs.add(id)
      );
    }
    if (!settings.tenorEnabled) {
      botCache.tenorDisabledGuildIDs.add(settings.guildID);
    }
    // if (settings.mailsSupportChannelID) {
    //   botCache.guildSupportChannelIDs.set(
    //     settings.guildID,
    //     settings.mailsSupportChannelID,
    //   );
    // }
    if (settings.isVIP) {
      botCache.vipGuildIDs.add(settings.guildID);
      const guild = cache.guilds.get(settings.guildID);
      if (guild) fetchMembers(guild);
    }
    if (settings.xpEnabled) {
      botCache.xpEnabledGuildIDs.add(settings.guildID);
    }
    if (settings.missionsDisabled) {
      botCache.missionsDisabledGuildIDs.add(settings.guildID);
    }
    if (settings.xpPerMessage) {
      botCache.guildsXPPerMessage.set(settings.guildID, settings.xpPerMessage);
    }
    if (settings.xpPerMinuteVoice) {
      botCache.guildsXPPerMinuteVoice.set(
        settings.guildID,
        settings.xpPerMinuteVoice,
      );
    }
  }

  for (const mirror of mirrors) {
    const cached = botCache.mirrors.get(mirror.sourceChannelID);
    if (cached) {
      botCache.mirrors.set(mirror.sourceChannelID, [...cached, mirror]);
    } else {
      botCache.mirrors.set(mirror.sourceChannelID, [mirror]);
    }
  }

  // Add blacklisted users and guilds to cache so bot will ignore them.
  for (const blacklist of blacklisted) {
    botCache.blacklistedIDs.add(blacklist.id);
  }

  // Add all spy records to cache to prepare them
  for (const record of spyRecords) {
    for (const word of record.words) {
      const current = botCache.spyRecords.get(word);
      // If the word doesnt exist we add a new one for this user id
      if (!current) botCache.spyRecords.set(word, [record.id]);
      // If it exist and this user id is not already set, add them
      else if (!current.includes(record.id)) {
        botCache.spyRecords.set(word, [...current, record.id]);
      }
    }
  }

  console.log(
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`,
  );
};
