import { botCache } from "../../mod.ts";
import {
  cache,
  logger,
  editBotsStatus,
  StatusTypes,
  ActivityType,
} from "../../deps.ts";
import Guild from "../database/schemas/guilds.ts";
import { configs } from "../../configs.ts";

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

  const guildSettings = await Guild.select("id", "prefix", "language").all();
  for (const settings of guildSettings) {
    if (settings.prefix !== configs.prefix) botCache.guildPrefixes.set(settings.id, settings.prefix);
    if (settings.language !== "en_US") botCache.guildLanguages.set(settings.id, settings.language);
  }

  logger.success(
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`,
  );
};
