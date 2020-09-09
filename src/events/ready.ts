import { botCache } from "../../mod.ts";
import {
  cache,
  logger,
  editBotsStatus,
  StatusTypes,
  ActivityType,
  getTime,
  fetchMembers,
  bgYellow,
  black,
  bgBlue,
} from "../../deps.ts";
import { configs } from "../../configs.ts";
import { guildsDatabase } from "../database/schemas/guilds.ts";
import { mirrorsDatabase } from "../database/schemas/mirrors.ts";

botCache.eventHandlers.ready = async function () {
  editBotsStatus(
    StatusTypes.DoNotDisturb,
    "Discordeno Best Lib",
    ActivityType.Game,
  );

  logger.info(`Loaded ${botCache.arguments.size} Argument(s)`);
  logger.info(`Loaded ${botCache.commands.size} Command(s)`);
  logger.info(`Loaded ${Object.keys(botCache.eventHandlers).length} Event(s)`);
  logger.info(`Loaded ${botCache.inhibitors.size} Inhibitor(s)`);
  logger.info(`Loaded ${botCache.monitors.size} Monitor(s)`);
  logger.info(`Loaded ${botCache.tasks.size} Task(s)`);

  botCache.tasks.forEach((task) => {
    setInterval(() => {
      console.log(
        `${bgBlue(`[${getTime()}]`)} => [TASK: ${
          bgYellow(black(task.name))
        }] Started.`,
      );
      task.execute();
    }, task.interval);
  });

  logger.info(`Loading Cached Settings:`);

  const guildSettings = await guildsDatabase.find();
  const mirrors = await mirrorsDatabase.find();

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
      botCache.tenorDisabledGuildIDs.add(settings.guildID)
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
  }

  for (const mirror of mirrors) {
    const cached = botCache.mirrors.get(mirror.sourceChannelID);
    if (cached) {
      botCache.mirrors.set(mirror.sourceChannelID, [...cached, mirror]);
    } else {
      botCache.mirrors.set(mirror.sourceChannelID, [mirror]);
    }
  }

  logger.success(
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`,
  );
};
