import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { botCache, Role } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";

createSubcommand("settings-staff-mods", {
  name: "remove",
  aliases: ["r"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
  arguments: [{ name: "role", type: "role" }] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);
    if (!settings) return botCache.helpers.reactSuccess(message);

    if (settings.modRoleIDs.includes(args.role.id)) {
      await db.guilds.update(message.guildID, {
        modRoleIDs: settings.modRoleIDs.filter((id) => id !== args.role.id),
      });
    }

    return botCache.helpers.reactSuccess(message);
  },
});
