import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles-levels", {
  name: "remove",
  aliases: ["r"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "level", type: "number", minimum: 1, maximum: 200 },
    { name: "roles", type: "...roles" },
  ] as const,
  execute: async function (message, args) {
    const level = await db.levels.get(`${message.guildID}-${args.level}`);
    if (!level) return botCache.helpers.reactError(message);

    await db.levels.update(`${message.guildID}-${args.level}`, {
      roleIDs: level.roleIDs.filter((id) => !args.roles.some((r) => r.id === id)),
    });
    return botCache.helpers.reactSuccess(message);
  },
});
