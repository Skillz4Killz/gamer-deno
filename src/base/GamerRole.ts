import { Camelize, DiscordRole } from "@discordeno/bot";
import { Role } from "guilded.js";
import { Platforms } from "./typings.js";

export class GamerRole {
    /** The platform in which this message was sent. */
    platform: Platforms;
    /** The message id. A snowflake on discord and uuid on guilded. */
    id: string | number;
    /** The name of the role. */
    name: string = "NO ROLE NAME FOUND";

    constructor(payload: Camelize<DiscordRole> | Role) {
        this.id = payload.id;

        if (this.isDiscordRole(payload)) {
            this.platform = Platforms.Discord;
            this.name = payload.name;
        } else {
            this.platform = Platforms.Guilded;
        }
    }

    isDiscordRole(payload: Camelize<DiscordRole> | Role): payload is Camelize<DiscordRole> {
        return typeof payload.id === "string";
    }
}

export default GamerRole;
