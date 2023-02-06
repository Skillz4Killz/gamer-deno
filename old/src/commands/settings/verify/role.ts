import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-verify", {
  name: "role",
  permissionLevels: [PermissionLevels.ADMIN],
  vipServerOnly: true,
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "role", type: "role" },
  ] as const,
  execute: async function (message, args) {
    await db.guilds.update(message.guildID, { verifyRoleID: args.role.id });
    return botCache.helpers.reactSuccess(message);
  },
});
