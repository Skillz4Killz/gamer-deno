import { Camelize, Collection, DiscordGuild } from "@discordeno/bot";
import { Platforms } from "./typings.js";
import { Server } from "guilded.js/types/structures/Server.js";
import GamerRole from "./GamerRole.js";

export class GamerGuild {
    /** The platform in which this message was sent. */
    platform: Platforms;
    /** The message id. A snowflake on discord and uuid on guilded. */
    id: string;
    /** The roles available for this guild. */
    roles = new Collection<string | number, GamerRole>();

    constructor(payload: Camelize<DiscordGuild> | Server) {
        this.id = payload.id;

        if (this.isDiscordGuild(payload)) {
            this.platform = Platforms.Discord;
            for (const r of payload.roles) {
                const role = new GamerRole(r);
                this.roles.set(role.id, role);
            }
        } else {
            this.platform = Platforms.Guilded;
        }
    }

    isDiscordGuild(payload: Camelize<DiscordGuild> | Server): payload is Camelize<DiscordGuild> {
        return Reflect.has(payload, "afkTimeout");
    }
}

export default GamerGuild