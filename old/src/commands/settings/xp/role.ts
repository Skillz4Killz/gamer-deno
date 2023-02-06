import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-xp", {
  name: "role",
  aliases: ["r"],
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "role", type: "role" }] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);

    if (settings?.disabledXPRoleIDs.includes(args.role.id)) {
      await db.guilds.update(message.guildID, {
        disabledXPRoleIDs: settings.disabledXPRoleIDs.filter((id) => id !== args.role.id),
      });
    } else {
      await db.guilds.update(message.guildID, {
        disabledXPRoleIDs: [...(settings?.disabledXPRoleIDs || []), args.role.id],
      });
    }

    return botCache.helpers.reactSuccess(message);
  },
});
