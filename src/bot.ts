import { Bot, createBot, createLogger, GatewayIntents } from "@discordeno/bot";
import { configs } from "./configs";
import { eventHandlers } from "./events";

export const Gamer: GamerBot = {
    discord: createBot({
        intents: GatewayIntents.MessageContent,
        token: configs.platforms.discord.token,
        events: eventHandlers,
    }),
    loggers: {
        discord: createLogger({ name: "Discord" }),
        guilded: createLogger({ name: "Guilded" }),
    },
};

export interface GamerBot {
    /** The bot on discord platform. */
    discord: Bot;
    /** The bot on guilded platform. */
    // TODO: guilded - add guilded bot
    // guilded: GuildedBot
    /** Loggers for each platform. */
    loggers: {
        discord: ReturnType<typeof createLogger>;
        guilded: ReturnType<typeof createLogger>;
    };
}
