import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand('settings-staff', {
    name: 'mods',
    permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
    arguments: [
        { name: "subcommand", type: "subcommands" },
    ],
    execute: function (message, args, guild) {
    },
})
