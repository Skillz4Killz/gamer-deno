import { botCache } from "../../mod.ts";
import {
  cache,
  logger,
  editBotsStatus,
  StatusTypes,
  ActivityType,
  getTime,
} from "../../deps.ts";
import { configs } from "../../configs.ts";
import { guildsDatabase } from "../database/schemas/guilds.ts";
import {
  bgYellow,
  black,
  bgBlue,
} from "https://deno.land/std@0.63.0/fmt/colors.ts";

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
    const command = ``;

    console.log(
      `${bgBlue(`[${getTime()}]`)} => [COMMAND: ${
        bgYellow(black(task.name))
      }] Started.`,
    );
    setInterval(() => task.execute(), task.interval);
  });

  logger.info(`Loading Cached Settings:`);

  const guildSettings = await guildsDatabase.find();
  // @ts-ignore TODO: Fix https://github.com/manyuanrong/deno_mongo/issues/105
  for (const settings of guildSettings) {
    if (settings.prefix !== configs.prefix) {
      botCache.guildPrefixes.set(settings.guildID, settings.prefix);
    }
    if (settings.language !== "en_US") {
      botCache.guildLanguages.set(settings.guildID, settings.language);
    }
    if (settings.autoembedChannelIDs) {
      // @ts-ignore TODO: will fix when settings above is fixed
      settings.autoembedChannelIDs.forEach((id) =>
        botCache.autoEmbedChannelIDs.add(id)
      );
    }
  }

  logger.success(
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`,
  );
};
