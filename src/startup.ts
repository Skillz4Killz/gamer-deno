import { loadCommands } from "./commands/index.js";
import { Gamer } from "./bot.js";
import { configs } from "./configs.js";
import { setEventsOnGuilded } from "./events/guilded.js";

export async function startup() {
    // Loads all the commands into Gamer.commands
    loadCommands();

    // TODO: prisma - Load database values into cache

    if (configs.platforms.discord.token) {
        // TODO: interactions - re-enable this when debuggable
        // if (configs.devServerId) {
        //     const interactionCommands = makeInteractionCommands();
        //     Gamer.loggers.discord.info(`[Startup] Updating interaction commands.`)
        //     await Gamer.discord.rest.upsertGuildApplicationCommands(configs.devServerId, interactionCommands)
        //     Gamer.loggers.discord.info(`[Startup] Updated interaction commands.`)
        // }

        Gamer.loggers.discord.info(`[Startup] Starting Discord bot.`)
        await Gamer.discord.start();
        Gamer.loggers.discord.info(`[Startup] Started Discord bot.`)
    }

    if (configs.platforms.guilded.token) {
        // Adds event listeners to guilded client
        setEventsOnGuilded()

        Gamer.loggers.guilded.info(`[Startup] Starting Guilded bot.`)
        Gamer.guilded.login()
        Gamer.loggers.guilded.info(`[Startup] Starting Guilded bot.`)
    }

    // Start up all tasks
}
