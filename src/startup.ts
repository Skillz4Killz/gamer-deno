import { loadArguments } from "./arguments/index.js";
import { Gamer } from "./bot.js";
import { loadCommands, makeInteractionCommands } from "./commands/index.js";
import { configs } from "./configs.js";
import { setEventsOnGuilded } from "./events/guilded.js";

export async function startup() {
    // Loads all the commands into Gamer.commands
    loadCommands();
    // Loads all the arguments that commands will need.
    loadArguments();

    // TODO: prisma - Load database values into cache

    if (configs.platforms.discord.token) {
        if (configs.devServerId) {
            const interactionCommands = makeInteractionCommands(configs.devServerId);
            Gamer.loggers.discord.info(`[Startup] Updating interaction commands.`);
            await Gamer.discord.helpers.upsertGuildApplicationCommands(configs.devServerId, interactionCommands);
            Gamer.loggers.discord.info(`[Startup] Updated interaction commands.`);
        }

        Gamer.loggers.discord.info(`[Startup] Starting Discord bot.`);
        await Gamer.discord.start();
        Gamer.loggers.discord.info(`[Startup] Started Discord bot.`);
    }

    if (configs.platforms.guilded.token) {
        // Adds event listeners to guilded client
        setEventsOnGuilded();

        Gamer.loggers.guilded.info(`[Startup] Starting Guilded bot.`);
        Gamer.guilded.login();
        Gamer.loggers.guilded.info(`[Startup] Starting Guilded bot.`);
    }

    // Start up all tasks
}
