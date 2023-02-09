import * as dotenv from "dotenv";

dotenv.config();

export const configs = {
    bot: {
        id: BigInt(ensureEnv("BOT_ID")),
        token: ensureEnv("BOT_TOKEN"),
    },

    baseUrl: ensureEnv("WEBSITE_BASE_URL"),

    dragon: {
        port: Number(ensureEnv("DRAGON_PORT")),
        host: ensureEnv("DRAGON_HOST"),
        password: ensureEnv("DRAGON_PASSWORD"),
    },

    fernet: {
        sessionSecret: ensureEnv("FERNET_SESSION_SECRET"),
    },

    komi: {
        id: ensureEnv("KOMI_ID"),
        secret: ensureEnv("KOMI_SECRET"),
    },
};

function ensureEnv(name: string): string {
    const variable = process.env[name];

    if (!variable) {
        throw new Error(`Required ENV variable "${name}" has not been found.`);
    }

    return variable;
}
