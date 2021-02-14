import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-mute", {
  name: "role",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [{ name: "role", type: "role" }] as const,
  execute: async function (message, args) {
    await db.guilds.update(message.guildID, { muteRoleID: args.role.id });
    return botCache.helpers.reactSuccess(message);
  },
});
