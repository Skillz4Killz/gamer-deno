import { botCache } from "../../mod.ts";
import {
  cache,
  logger,
  editBotsStatus,
  StatusTypes,
  ActivityType,
} from "../../deps.ts";
import { configs } from "../../configs.ts";
import { guildsDatabase } from "../database/schemas/guilds.ts";

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

  logger.info(`Loading Cached Settings:`);

  const guildSettings = await guildsDatabase.find();
  // @ts-ignore TODO: Fix https://github.com/manyuanrong/deno_mongo/issues/105
  for (const settings of guildSettings) {
    if (settings.prefix !== configs.prefix) botCache.guildPrefixes.set(settings.guildID, settings.prefix);
    if (settings.language !== "en_US") botCache.guildLanguages.set(settings.guildID, settings.language);
  }

  logger.success(
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`,
  );
};
