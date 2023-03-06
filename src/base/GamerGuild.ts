import { Camelize, Collection, DiscordGuild } from "@discordeno/bot";
import { Server } from "guilded.js/types/structures/Server.js";
import GamerChannel from "./GamerChannel.js";
import GamerRole from "./GamerRole.js";
import { Platforms } from "./typings.js";

export class GamerGuild {
    /** The platform in which this message was sent. */
    platform: Platforms;
    /** The message id. A snowflake on discord and uuid on guilded. */
    id: string;
    /** The roles available for this guild. */
    roles = new Collection<string | number, GamerRole>();
    /** The channels available for this guild. */
    channels = new Collection<string, GamerChannel>();

    constructor(payload: Camelize<DiscordGuild> | Server) {
        this.id = payload.id;

        if (this.isDiscordGuild(payload)) {
            this.platform = Platforms.Discord;
            for (const r of payload.roles) {
                const role = new GamerRole(r);
                this.roles.set(role.id, role);
            }
            for (const c of payload.channels ?? []) {
                const channel = new GamerChannel(c);
                this.channels.set(channel.id, channel);
            }
        } else {
            this.platform = Platforms.Guilded;
        }
    }

    isDiscordGuild(payload: Camelize<DiscordGuild> | Server): payload is Camelize<DiscordGuild> {
        return Reflect.has(payload, "afkTimeout");
    }
}

export default GamerGuild;
