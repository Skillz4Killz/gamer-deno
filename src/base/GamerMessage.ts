import { avatarUrl, Camelize, delay, InteractionCallbackData } from "@discordeno/bot";
import { DiscordEmbed, DiscordInteraction, DiscordMessage, InteractionResponseTypes } from "@discordeno/types";
import { Message } from "guilded.js/types/index.js";
import { Gamer } from "../bot.js";
import { configs } from "../configs.js";
import { parsePrefix } from "../events/helpers/commands.js";
import { deleteMessage, needResponse, sendMessage, SendMessage } from "../utils/platforms/messages.js";
import { snowflakeToTimestamp } from "../utils/snowflakes.js";
import { Components } from "./Components.js";
import GamerGuild from "./GamerGuild.js";
import { TranslationKeys, TranslationKeysForArrays } from "./languages/english.js";
import { translate, translateArray } from "./languages/translate.js";
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
    /** The id of the channel this message was sent in. */
    channelId: string;
    /** The id of the guild if this message was sent in a guild. */
    guildId?: string;
    /** The timestamp in milliseconds when this message was created. */
    timestamp: number;
    /** Whether or not this message was sent by a bot. */
    isFromABot: boolean = false;
    /** The details of the author who sent this message. */
    author: {
        /** The id of the user that sent this message. */
        id: string;
        /** The username of the user who sent this message. */
        username: string;
        /** The discriminator of the user who sent this message. */
        discriminator: string;
        /** The avatar of the user who sent this message. */
        avatar?: string;
    };
    /** The ids of the items that are mentioned in this message. */
    mentions: {
        /** The users that are mentioned in this message. */
        users: string[];
    } = { users: [] };
    /** Interaction related data on discord */
    interaction?: {
        /** The interaction id */
        id: string;
        /** The interaction token. */
        token: string;
        /** Whether or not this interaction has been acknowledged by the bot atleast once. */
        acknowledged: boolean;
    };
    /** The raw payload in the message constructor. */
    raw: Message | Camelize<DiscordMessage> | Camelize<DiscordInteraction>;

    constructor(data: Message | Camelize<DiscordMessage> | Camelize<DiscordInteraction>) {
        this.id = data.id;
        this.raw = data;

        if (this.isDiscordMessage(data)) {
            this.content = data.content ?? "";
            this.embeds = data.embeds ?? [];
            this.author = {
                id: data.author.id,
                username: data.author.username,
                discriminator: data.author.discriminator,
                avatar: data.author.avatar ?? undefined,
            };
            if (data.mentions) this.mentions.users = data.mentions.map((m) => m.id);
            this.isFromABot = data.author.bot ?? false;
            this.channelId = data.channelId;
            this.guildId = data.guildId;
            this.timestamp = Date.parse(data.timestamp);
            this.platform = Platforms.Discord;
        } else if (this.isDiscordInteraction(data)) {
            this.platform = Platforms.Discord;
            this.author = {
                id: data.member?.user?.id ?? data.user!.id,
                username: data.member?.user?.username ?? data.user!.username,
                discriminator: data.member?.user?.discriminator ?? data.user!.discriminator,
                avatar: data.member?.user?.avatar ?? data.user!.avatar ?? undefined,
            };
            this.channelId = data.channelId!;
            this.timestamp = snowflakeToTimestamp(data.id);
            this.content = '';
            if (data.data?.customId?.startsWith('cmdReplay')) {
                
            }
            const cmd = Gamer.commands.get(data.data?.name!);
            if (cmd) {
                for (const arg of cmd.arguments ?? []) {
                    const opt = data.data?.options?.find(o => o.name === arg.name);
                    if (!opt) continue;

                    this.content += `-${opt.value}`;
                }
            }
            this.interaction = {
                id: data.id,
                token: data.token,
                acknowledged: false,
            };
        } else {
            this.author = {
                id: data.authorId,
                username: data.author!.name,
                // Guilded does not do discriminators
                discriminator: "1786",
                avatar: data.author?.avatar ?? undefined,
            };
            if (data.mentions?.users?.length) this.mentions.users = data.mentions.users.map((u) => u.id);
            this.content = data.content ?? "";
            this.channelId = data.channelId;
            this.guildId = data.serverId ?? undefined;
            this.isFromABot = !!data.createdByBotId;
            this.timestamp = data.createdAt.getTime();
            this.platform = Platforms.Guilded;
        }
    }

    /** The avatar url of the user who sent this message. */
    get avatarURL(): string {
        return this.isOnDiscord ? avatarUrl(this.author.id, this.author.discriminator, { avatar: this.author.avatar }) : this.author.avatar!;
    }

    /** Whether or not this message was sent in a vip server or by a vip user. */
    get isFromVIP(): boolean {
        return Gamer.vip.guilds.has(this.guildId!) || Gamer.vip.users.has(this.author.id);
    }

    /** Whether or not this message was sent in Discord. */
    get isOnDiscord(): boolean {
        return this.platform === Platforms.Discord;
    }

    /** The user tag. On Discord it is xxx#1234 but on guilded it is xxxx:id since there is no discriminator. */
    get tag(): string {
        return `${this.author.username}#${this.isOnDiscord ? this.author.discriminator : this.author.id}`;
    }

    /** Delete this message. */
    async delete(reason: string, delayMilliseconds?: number) {
        if (delayMilliseconds) await delay(delayMilliseconds);
        return await deleteMessage(this.channelId, this.id, reason, { platform: this.platform });
    }

    /** Gets a guild from either the cache or fetches it from the api. */
    async getGuild() {
        if (!this.guildId) return;

        const payload = this.isOnDiscord ? await Gamer.discord.rest.getGuild(this.guildId) : await Gamer.guilded.servers.fetch(this.guildId);

        return new GamerGuild(payload);
    }

    /** Begins a process of requesting a response from the user. */
    async needResponse(options: {
        modal?: InteractionCallbackData & {
            /** Type of the reply */
            type?: InteractionResponseTypes;
        };
    }) {
        return await needResponse(this, {
            ...options,
            platform: this.platform,
        });
    }

    /** Send a reply to this message. */
    async reply(content: SendMessage | string, options?: { addReplay?: boolean }) {
        if (typeof content === "string") content = { content, embeds: [], reply: true };
        if (options?.addReplay !== false && this.content.length < 90) {
            if (content.components?.length) {
                console.log("HOW TO ADD A BUTTON");
            } else {
                const basePrefix = parsePrefix(this.guildId);
                let prefix = [...basePrefix].join("");

                const mentions = [
                    `<@!${Gamer.discord.rest.applicationId}>`,
                    `<@${Gamer.discord.rest.applicationId}>`,
                    `@${configs.bot.name}`,
                    configs.bot.name,
                ];

                for (const mention of mentions) {
                    if (this.content.toLowerCase().startsWith(mention.toLowerCase())) prefix = mention;
                    if (this.content.toLowerCase().startsWith(mention.toLowerCase() + " ")) prefix = `${mention} `;
                }

                console.log('----- making button content', this.content);
                console.log(this.content.startsWith(prefix) ? this.content.substring(prefix.length) : this.content);
                console.log('----')
                content.components = new Components().addButton(
                    "Replay",
                    "Primary",
                    `cmdReplay-${this.content.startsWith(prefix) ? this.content.substring(prefix.length) : this.content}`,
                    { emoji: "🔁" },
                );
            }
        }
        return await this.send(content);
    }

    /** Send a message to the same channel this message was sent in. */
    async send(content: SendMessage | string) {
        if (typeof content === "string") content = { content, embeds: [] };

        if (this.interaction) {
            if (!this.interaction.acknowledged) {
                // Mark as acknowledged as this will make next send() use followup
                this.interaction.acknowledged = true;

                return await Gamer.discord.rest.sendInteractionResponse(this.interaction.id, this.interaction.token, {
                    type: InteractionResponseTypes.ChannelMessageWithSource,
                    data: content,
                });
            }

            return await Gamer.discord.rest.sendFollowupMessage(this.interaction.token, content);
        }

        return await sendMessage(this.channelId, content, { platform: this.platform, reply: content.reply ? this.id : undefined });
    }

    /** Translate a key using the translations. */
    translate(key: TranslationKeys, ...args: any[]) {
        return translate(this.guildId ?? "", key, ...args);
    }

    /** Translates an array using the translations. */
    translateArray(key: TranslationKeysForArrays, ...args: any[]) {
        return translateArray(this.guildId ?? "", key, ...args);
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
