import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { botCache, Role } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";

createSubcommand('settings-staff-mods', {
    name: 'add',
    aliases: ["a"],
    permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
    arguments: [
        { name: "role", type: "role" },
    ],
    execute: async function (message, args: SettingsStaffModsAddArgs, guild) {
        const settings = await db.guilds.get(message.guildID);
        if (!settings) {
            db.guilds.create(message.guildID, { modRoleIDs: [args.role.id] });
        } else if (!settings.modRoleIDs.includes(args.role.id)) {
            db.guilds.update(message.guildID, { modRoleIDs: [...settings.modRoleIDs, args.role.id] });
        }

        return botCache.helpers.reactSuccess(message);
    },
})

interface SettingsStaffModsAddArgs {
    role: Role;
}