import { DiscordEmbed } from "@discordeno/bot";
import { GamerMessage } from "../../base/GamerMessage";
import { Platforms } from "../../base/typings";
import { Gamer } from "../../bot";

export async function sendMessage(channelId: string, content: SendMessage, options: { platform: Platforms; reply?: string; }) {
    if (options.platform === Platforms.Discord) {
        const message = await Gamer.discord.rest.sendMessage(channelId, {
            content: content.content,
            embeds: content.embeds,
            messageReference: options.reply ? {
                messageId: options.reply,
                failIfNotExists: false,
            } : undefined
        });
        return new GamerMessage(message);
    }

    return;
}

export async function deleteMessage(channelId: string, messageId: string, reason: string, options: { platform: Platforms }): Promise<void> {
    if (options.platform === Platforms.Discord) {
        return await Gamer.discord.rest.deleteMessage(channelId, messageId, reason);
    }
}

export async function deleteMessages(channelId: string, messageIds: string[], reason: string, options: { platform: Platforms }): Promise<void> {
    console.log(channelId, messageIds, reason)
    if (options.platform === Platforms.Discord) {
        // TODO: discordeno - implement in dd
        // return await Gamer.discord.rest.deleteMessages(channelId, messageIds, reason);
    }
}

export async function needResponse(message: GamerMessage) {
    // TODO: collector - implement message collector
    return message;
}

export interface SendMessage {
    /** The text itself to send. */
    content: string;
    /** The embeds that should be sent. */
    embeds: DiscordEmbed[];
    /** Whether or not to reply to this message. */
    reply?: boolean;
}
