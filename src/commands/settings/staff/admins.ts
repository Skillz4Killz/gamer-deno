import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-staff", {
  name: "admins",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
  arguments: [{ name: "role", type: "role", required: false }] as const,
  execute: async function (message, args) {
    await db.guilds.update(message.guildID, { adminRoleID: args.role?.id });
    return botCache.helpers.reactSuccess(message);
  },
});
