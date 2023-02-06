import { DiscordEmbed } from "@discordeno/bot";
import { GamerMessage } from "../../../base/GamerMessage";
import { Platforms } from "../../../base/typings";
import { Gamer } from "../../../bot";

export async function sendMessage(channelId: string, content: SendMessage, options: { platform: Platforms }) {
    if (options.platform === Platforms.Discord) {
        const message = await Gamer.discord.rest.sendMessage(channelId, {
            content: content.content,
            embeds: content.embeds,
        });
        return new GamerMessage(message);
    }
}

export interface SendMessage {
    /** The text itself to send. */
    content: string;
    /** The embeds that should be sent. */
    embeds: DiscordEmbed[];
}
