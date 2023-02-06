import { loadCommands } from "commands";
import { Gamer } from "./bot";
import { configs } from "./configs";

export async function startup() {
    // Loads all the commands into Gamer.commands
    loadCommands();

    // TODO: prisma - Load database values into cache

    if (configs.platforms.discord.token) {
        // TODO: interactions - add all commands.
        Gamer.loggers.discord.info(`[Startup] Starting Discord bot.`)
        await Gamer.discord.start();
        Gamer.loggers.discord.info(`[Startup] Started Discord bot.`)
    }

    if (configs.platforms.guilded.token) {
        Gamer.loggers.guilded.info(`[Startup] Starting Guilded bot.`)
        Gamer.guilded.login()
        Gamer.loggers.guilded.info(`[Startup] Starting Guilded bot.`)
    }

    // Start up all tasks
}
