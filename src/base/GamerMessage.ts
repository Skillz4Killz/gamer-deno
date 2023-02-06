import { Camelize } from "@discordeno/bot";
import { DiscordEmbed, DiscordMessage } from "@discordeno/types";
import { sendMessage, SendMessage } from "../utils/platforms/shared/messages";
import { Platforms } from "./typings";

export class GamerMessage {
    /** The platform in which this message was sent. */
    platform: Platforms
    /** The message id. A snowflake on discord and uuid on guilded. */
    id: string;
    /** The message content. */
    content: string = "";
    /** Array of embeds */
    embeds: DiscordEmbed[] = [];
    /** The id of the user that sent this message. */
    authorId: string;
    /** The id of the channel this message was sent in. */
    channelId: string

    /** Interaction related data on discord */
    interaction?: {
        /** The interaction id */
        id: string;
        /** The interaction token. */
        token: string;
        /** Whether or not this interaction has been acknowledged by the bot atleast once. */
        acknowledged: boolean;
    };

    constructor(data: GuildedMessage | Camelize<DiscordMessage>) {
        this.id = data.id;

        if (this.isDiscordMessage(data)) {
            this.embeds = data.embeds ?? [];
            this.authorId = data.author.id;
            this.channelId = data.channelId;
            this.platform = Platforms.Discord
        } else {
            this.authorId = data.createdBy;
            this.channelId = data.channelId;
            this.platform = Platforms.Guilded
        }

        this.content = data.content ?? "";
    }

    /** Send a message to the same channel this message was sent in. */
    async send(content: SendMessage) {
        return await sendMessage(this.channelId, content, { platform: this.platform });
    }

    isDiscordMessage(data: GuildedMessage | Camelize<DiscordMessage>): data is Camelize<DiscordMessage> {
        return !Reflect.has(data, "createdBy");
    }

    isGuildedMessage(data: GuildedMessage | Camelize<DiscordMessage>): data is GuildedMessage {
        return Reflect.has(data, "createdBy");
    }
}

// TODO: guilded - use proper class here
export interface GuildedMessage {
    id: string;
    content: string;
    createdBy: string;
    channelId: string
}
