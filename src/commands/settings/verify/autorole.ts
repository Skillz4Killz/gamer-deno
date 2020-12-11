import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand('settings-verify-role', {
    name: "autohuman",
    permissionLevels: [PermissionLevels.ADMIN],
    vipServerOnly: true,
    arguments: [
        { name: "role", type: "role" }
    ] as const,
    execute: function (message, args) {
        db.guilds.update(message.guildID, { userAutoRoleID: args.role.id });
        botCache.helpers.reactSuccess(message);
    }
})

createSubcommand('settings-verify-role', {
    name: "autobots",
    permissionLevels: [PermissionLevels.ADMIN],
    vipServerOnly: true,
    arguments: [
        { name: "role", type: "role" }
    ] as const,
    execute: function (message, args) {
        db.guilds.update(message.guildID, { botsAutoRoleID: args.role.id });
        botCache.helpers.reactSuccess(message);
    }
})