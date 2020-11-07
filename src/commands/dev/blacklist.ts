import { botCache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
    name: "blacklist",
    aliases: ["bl"],
    permissionLevels: [PermissionLevels.BOT_DEVS, PermissionLevels.BOT_OWNER, PermissionLevels.BOT_SUPPORT],
    arguments: [
        { name: "type", type: "string", literals: ["add", "remove"] },
        { name: "userOrGuild", type: "string", literals: ["user", "guild"] },
        { name: "id", type: "snowflake" }
    ],
    execute: function (message, args: BlacklistArgs) {
        if (args.type === "add") db.blacklisted.update(args.id, { type: args.userOrGuild });
        else db.blacklisted.delete(args.id);

        botCache.helpers.reactSuccess(message);
    }
})

interface BlacklistArgs {
    type: "add" | "remove";
    userOrGuild: "user" | "guild";
    id: string;
}