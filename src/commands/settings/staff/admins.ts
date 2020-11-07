import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { Role } from "../../../../deps.ts";

createSubcommand('settings-staff', {
    name: 'admins',
    permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
    arguments: [
        { name: "role", type: "role", required: false },
    ],
    execute: function (message, args: SettingsStaffAdminsArgs, guild) {
        db.update(message.guildID, { adminRoleID: args.role?.id });
        return botCache.helpers.reactSuccess(message);
    }
})

interface SettingsStaffAdminsArgs {
    role?: Role;
}