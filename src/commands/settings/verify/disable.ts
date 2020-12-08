import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand('settings-verify', {
    name: "disable",
    aliases: ["off", "disabled"],
    permissionLevels: [PermissionLevels.ADMIN],
    vipServerOnly: true,
    execute: function (message) {
        db.guilds.update(message.guildID, { verifyEnabled: false });
        botCache.helpers.reactSuccess(message);
    }
})