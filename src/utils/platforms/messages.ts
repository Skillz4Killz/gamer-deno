import { ActionRow, ButtonStyles, DiscordEmbed, InteractionResponseTypes, MessageComponentTypes, TextStyles } from "@discordeno/bot";
import { Embed } from "guilded.js";
import { GamerMessage } from "../../base/GamerMessage.js";
import { Platforms } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export async function fetchMessage(channelId: string, messageId: string, options: { platform: Platforms }) {
    if (options.platform === Platforms.Discord) {
        const message = await Gamer.discord.helpers.getMessage(channelId, messageId);
        return new GamerMessage(message);
    }

    const message = await Gamer.guilded.messages.fetch(channelId, messageId);
    return new GamerMessage(message);
}

export async function sendMessage(channelId: string, content: SendMessage, options: { platform: Platforms; reply?: string }) {
    if (options.platform === Platforms.Discord) {
        const message = await Gamer.discord.helpers.sendMessage(channelId, {
            content: content.content,
            embeds: content.embeds,
            components: content.components,
            messageReference: options.reply
                ? {
                      messageId: options.reply,
                      failIfNotExists: false,
                  }
                : undefined,
        });
        return new GamerMessage(message);
    }

    if (options.platform === Platforms.Guilded) {
        const embed = new Embed();
        if (!content.embeds) content.embeds = [];

        if (content.components) {
            const links: string[] = [];

            // Action row
            for (const row of content.components) {
                // The actual component
                for (const component of row.components) {
                    if (component.type === MessageComponentTypes.Button && component.style === ButtonStyles.Link)
                        links.push(`[🔗 ${component.label}](${component.url})`);
                }
            }

            if (links.length) embed.addField("🔗 Links", links.join("\n"));

            content.embeds.push(embed.toJSON());
        }

        const message = await Gamer.guilded.messages.send(channelId, {
            content: content.content || undefined,
            embeds: content.embeds.length ? content.embeds : undefined,
            replyMessageIds: options.reply ? [options.reply] : undefined,
        });

        // Have to fetch the user to make GamerMessage work. Only first will run the rest will use cache
        await Gamer.guilded.members.fetch(message.serverId!, message.authorId);

        return new GamerMessage(message);
    }

    return;
}

export async function deleteMessage(channelId: string, messageId: string, reason: string, options: { platform: Platforms }): Promise<void> {
    if (options.platform === Platforms.Discord) {
        return await Gamer.discord.helpers.deleteMessage(channelId, messageId, reason);
    }
}

export async function deleteMessages(channelId: string, messageIds: string[], reason: string, options: { platform: Platforms }): Promise<void> {
    console.log(channelId, messageIds, reason);
    if (options.platform === Platforms.Discord) {
        // TODO: discordeno - implement in dd
        // return await Gamer.discord.helpers.deleteMessages(channelId, messageIds, reason);
    }
}

export async function editMessage(channelId: string, messageId: string, content: SendMessage, options: { platform: Platforms; reply?: string }) {
    if (options.platform === Platforms.Discord) {
        const message = await Gamer.discord.helpers.editMessage(channelId, messageId, {
            content: content.content,
            embeds: content.embeds,
            components: content.components,
        });

        return new GamerMessage(message);
    }

    if (options.platform === Platforms.Guilded) {
        const embed = new Embed();
        if (!content.embeds) content.embeds = [];

        if (content.components) {
            const links: string[] = [];

            // Action row
            for (const row of content.components) {
                // The actual component
                for (const component of row.components) {
                    if (component.type === MessageComponentTypes.Button && component.style === ButtonStyles.Link)
                        links.push(`[🔗 ${component.label}](${component.url})`);
                }
            }

            if (links.length) embed.addField("🔗 Links", links.join("\n"));

            content.embeds.push(embed.toJSON());
        }

        const message = await Gamer.guilded.messages.cache.get(messageId)?.edit({
            content: content.content || undefined,
            embeds: content.embeds.length ? content.embeds : undefined,
            replyMessageIds: options.reply ? [options.reply] : undefined,
        });
        if (!message) return;
        
        // Have to fetch the user to make GamerMessage work. Only first will run the rest will use cache
        await Gamer.guilded.members.fetch(message.serverId!, message.authorId);

        return new GamerMessage(message);
    }

    return;
}

export async function needResponse(message: GamerMessage, options: NeedResponseOptions) {
    return new Promise<string | GamerMessage>(async (resolve, reject) => {
        Gamer.collectors.set(`${message.author.id}-${message.channelId}`, {
            createdAt: Date.now(),
            channelId: message.channelId,
            userId: message.author.id,
            questions: options.questions.length === 1 ? [] : options.questions.slice(1),
            resolve,
            reject,
        });

        if (message.interaction) {
            message.interaction.acknowledged = true;

            return await Gamer.discord.rest.sendInteractionResponse(message.interaction.id, message.interaction.token, {
                type: InteractionResponseTypes.Modal,
                data: {
                    title: options.title,
                    customId: options.customId,
                    components: options.questions.map((question) => ({
                        type: 1,
                        components: [
                            {
                                type: MessageComponentTypes.InputText,
                                customId: question.inputCustomId,
                                label: question.label,
                                style: question.long ? TextStyles.Paragraph : TextStyles.Short,
                                minLength: question.minLength,
                                maxLength: question.maxLength,
                                placeholder: question.placeholder,
                                required: true,
                            },
                        ],
                    })),
                },
            });
        }

        // send the question message
        void message.reply(options.title, { addReplay: false });
    });
}

export interface SendMessage {
    /** The text itself to send. */
    content?: string;
    /** The embeds that should be sent. */
    embeds?: DiscordEmbed[];
    /** Whether or not to reply to this message. */
    reply?: boolean;
    /** The Components to attach to this message. */
    components?: ActionRow[];
    /** The flags on this message. Used for discord interactions to send a private reply. */
    flags?: 64;
}

export interface NeedResponseOptions {
    title: string;
    customId: string;
    questions: {
        inputCustomId: string;
        label: string;
        long: boolean;
        minLength: number;
        maxLength: number;
        placeholder: string;
    }[];
}
