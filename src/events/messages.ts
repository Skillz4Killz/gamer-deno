import { Camelize, DiscordMessage } from "@discordeno/bot";
import { GamerMessage, GuildedMessage } from "../base/GamerMessage";
import { Gamer } from "../bot";

export async function messageCreate(payload: Camelize<DiscordMessage> | GuildedMessage) {
    const message = new GamerMessage(payload);
    if (message.isOnDiscord) {
        Gamer.loggers.discord.info(`Message seen in Discord. ${message.content}`);
    }
}
