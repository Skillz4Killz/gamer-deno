import { Bot, Collection, createBot, createLogger, GatewayIntents } from "@discordeno/bot";
import { Client } from "guilded.js";
import languages from "./base/languages/index.js";
import { Argument, Command } from "./base/typings.js";
import { configs } from "./configs.js";
import { eventHandlers } from "./events/index.js";

export const Gamer: GamerBot = {
    arguments: new Collection(),
    commands: new Collection(),
    stats: {
        commands: {
            executed: 0,
        },
    },
    discord: createBot({
        intents: GatewayIntents.GuildMessages | GatewayIntents.MessageContent,
        token: configs.platforms.discord.token,
        events: eventHandlers,
    }),
    guilded: new Client({
        token: configs.platforms.guilded.token,
    }),
    loggers: {
        discord: createLogger({ name: "Discord" }),
        guilded: createLogger({ name: "Guilded" }),
    },
    vip: {
        guilds: new Set(),
        users: new Set(),
        slowmode: new Map(),
        prefixes: new Map(),
        languages: new Map(),
    },
};

export interface GamerBot {
    /** The arguments that are able to be used. */
    arguments: Collection<string, Argument>;
    /** The commands that are able to be used. */
    commands: Collection<string, Command>;
    /** The cached stats for this bot. */
    stats: {
        commands: {
            executed: number;
        };
    };
    /** The bot on discord platform. */
    discord: Bot;
    /** The bot on guilded platform. */
    guilded: Client;
    /** Loggers for each platform. */
    loggers: {
        discord: ReturnType<typeof createLogger>;
        guilded: ReturnType<typeof createLogger>;
    };
    /** The vip related settings. */
    vip: {
        /** The ids of the guilds that are vip. */
        guilds: Set<string>;
        /** The ids of the users that are vip. */
        users: Set<string>;
        /** The ids of users who are currently frozen in slowmode. */
        slowmode: Map<string, number>;
        /** The custom prefixes that a guild can set. */
        prefixes: Map<string, string>;
        /** The custom languages that a guild can set. */
        languages: Map<string, keyof typeof languages>
    };
}
