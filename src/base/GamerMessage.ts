import { Camelize, delay } from "@discordeno/bot";
import { DiscordEmbed, DiscordInteraction, DiscordMessage } from "@discordeno/types";
import { Message } from "guilded.js/types/index.js";
import { deleteMessage, sendMessage, SendMessage } from "../utils/platforms/messages.js";
import { snowflakeToTimestamp } from "../utils/snowflakes.js";
import { Platforms } from "./typings.js";

export class GamerMessage {
    /** The platform in which this message was sent. */
    platform: Platforms;
    /** The message id. A snowflake on discord and uuid on guilded. */
    id: string;
    /** The message content. */
    content: string = "";
    /** Array of embeds */
    embeds: DiscordEmbed[] = [];
    /** The id of the user that sent this message. */
    authorId: string;
    /** The id of the channel this message was sent in. */
    channelId: string;
    /** The id of the guild if this message was sent in a guild. */
    guildId?: string;
    /** The timestamp in milliseconds when this message was created. */
    timestamp: number;
    /** Whether or not this message was sent by a bot. */
    isFromABot: boolean = false;

    /** Interaction related data on discord */
    interaction?: {
        /** The interaction id */
        id: string;
        /** The interaction token. */
        token: string;
        /** Whether or not this interaction has been acknowledged by the bot atleast once. */
        acknowledged: boolean;
    };

    constructor(data: Message | Camelize<DiscordMessage> | Camelize<DiscordInteraction>) {
        this.id = data.id;

        if (this.isDiscordMessage(data)) {
            this.content = data.content ?? "";
            this.embeds = data.embeds ?? [];
            this.authorId = data.author.id;
            this.isFromABot = data.author.bot ?? false;
            this.channelId = data.channelId;
            this.guildId = data.guildId;
            this.timestamp = Date.parse(data.timestamp);
            this.platform = Platforms.Discord;
        } else if (this.isDiscordInteraction(data)) {
            this.platform = Platforms.Discord;
            this.authorId = data.member?.user.id ?? data.user!.id;
            this.channelId = data.channelId!;
            this.timestamp = snowflakeToTimestamp(data.id);
            this.content = "";
            this.interaction = {
                id: data.id,
                token: data.token,
                acknowledged: false,
            };
        } else {
            this.authorId = data.createdById;
            this.content = data.content ?? "";
            this.channelId = data.channelId;
            this.guildId = data.serverId ?? undefined;
            this.isFromABot = !!data.createdByBotId;
            this.timestamp = data.createdAt.getTime();
            this.platform = Platforms.Guilded;
        }

    }

    /** Whether or not this message was sent in Discord. */
    get isOnDiscord(): boolean {
        return this.platform === Platforms.Discord;
    }

    /** Delete this message. */
    async delete(reason: string, delayMilliseconds?: number) {
        if (delayMilliseconds) await delay(delayMilliseconds);
        return await deleteMessage(this.channelId, this.id, reason, { platform: this.platform });
    }

    /** Send a reply to this message. */
    async reply(content: SendMessage | string) {
        if (typeof content === "string") content = { content, embeds: [], reply: true };
        return await this.send(content);
    }

    /** Send a message to the same channel this message was sent in. */
    async send(content: SendMessage | string) {
        if (typeof content === "string") content = { content, embeds: [] };

        return await sendMessage(this.channelId, content, { platform: this.platform, reply: content.reply ? this.id : undefined });
    }

    /** Translate a key using the translations. */
    translate(key: string, ...args: any[]) {
        console.log(key, args);
        return key;
        // TODO: translate - make this implementation work.
        // return translate(this.guildId ?? "", key, ...args)
    }

    isDiscordMessage(data: Message | Camelize<DiscordMessage> | Camelize<DiscordInteraction>): data is Camelize<DiscordMessage> {
        return !Reflect.has(data, "createdById") && !Reflect.has(data, "token");
    }

    isDiscordInteraction(data: Message | Camelize<DiscordMessage> | Camelize<DiscordInteraction>): data is Camelize<DiscordInteraction> {
        return Reflect.has(data, "token");
    }

    isGuildedMessage(data: Message | Camelize<DiscordMessage>): data is Message {
        return Reflect.has(data, "createdById");
    }
}
