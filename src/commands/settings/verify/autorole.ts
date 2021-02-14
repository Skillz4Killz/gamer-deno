import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-verify-role", {
  name: "autohuman",
  permissionLevels: [PermissionLevels.ADMIN],
  vipServerOnly: true,
  arguments: [{ name: "role", type: "role" }] as const,
  execute: async function (message, args) {
    await db.guilds.update(message.guildID, { userAutoRoleID: args.role.id });
    return botCache.helpers.reactSuccess(message);
  },
});

createSubcommand("settings-verify-role", {
  name: "autobots",
  permissionLevels: [PermissionLevels.ADMIN],
  vipServerOnly: true,
  arguments: [{ name: "role", type: "role" }] as const,
  execute: async function (message, args) {
    await db.guilds.update(message.guildID, { botsAutoRoleID: args.role.id });
    return botCache.helpers.reactSuccess(message);
  },
});
