import { Bot, createBot } from "@discordeno/bot";
import { configs } from "../old/configs.example";

export const Gamer: GamerBot = {
    discord: createBot({
        token: configs.token,
        events: {},
    }),
};

export interface GamerBot {
    /** The bot on discord platform. */
    discord: Bot;
    /** The bot on guilded platform. */
}
