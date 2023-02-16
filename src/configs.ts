import { parseEnvFile, typeSave } from "./utils/dotenv.js";

// Reads the .env file and makes an object we can work with
const parsed = parseEnvFile()["parsed"] as GamerEnvConfigs;

export interface GamerEnvConfigs {
    DISCORD_TOKEN?: string;
    GUILDED_TOKEN?: string;
    PREFIX?: string;
    BOT_NAME?: string;
    DEV_SERVER_ID?: string;
}

export const configs = {
    /** The id of the server where the bot is tested. */
    devServerId: typeSave(parsed.DEV_SERVER_ID || "", "string", "config#DEV_SERVER_ID"),
    /** Config settings for the bot itself. */
    bot: {
        name: typeSave(parsed.BOT_NAME || "Gamer", "string", "config#BOT_NAME"),
    },
    /** The command prefix for message based commands. */
    prefix: typeSave(parsed.PREFIX || ".", "string", "config#PREFIX"),
    /** Configs related to specific platforms. */
    platforms: {
        /** Configs related to discord platform. */
        discord: {
            token: typeSave(parsed.DISCORD_TOKEN || "", "string", "config#DISCORD_TOKEN"),
        },
        /** Configs related to guilded platform. */
        guilded: {
            token: typeSave(parsed.GUILDED_TOKEN || "", "string", "config#GUILDED_TOKEN"),
        },
    },
};