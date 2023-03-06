import { Camelize, ChannelTypes, DiscordChannel } from "@discordeno/bot";
import { Channel, ChannelType } from "guilded.js";
import { Platforms } from "./typings.js";

export class GamerChannel {
    /** The platform in which this message was sent. */
    platform: Platforms;
    /** The message id. A snowflake on discord and uuid on guilded. */
    id: string;
    /** The name of the channel. */
    name: string = "NO CHANNEL NAME FOUND";
    /** The type of channel. */
    type: number;

    constructor(payload: Camelize<DiscordChannel> | Channel) {
        this.id = payload.id;
        if (payload.name) this.name = payload.name;

        if (this.isDiscordChannel(payload)) {
            this.platform = Platforms.Discord;
            this.type = payload.type;
        } else {
            this.platform = Platforms.Guilded;
            this.type = payload.type;
        }
    }

    isTextBasedChannel(): boolean {
        if (this.platform === Platforms.Discord) {
            return [
                ChannelTypes.AnnouncementThread,
                ChannelTypes.GuildAnnouncement,
                ChannelTypes.GuildText,
                ChannelTypes.PrivateThread,
                ChannelTypes.PublicThread,
            ].includes(this.type);
        }

        return [ChannelType.Announcements, ChannelType.Chat].includes(this.type);
    }

    isDiscordChannel(data: Camelize<DiscordChannel> | Channel): data is Camelize<DiscordChannel> {
        return !Reflect.has(data, "createdById") && !Reflect.has(data, "token");
    }
}

export default GamerChannel;
