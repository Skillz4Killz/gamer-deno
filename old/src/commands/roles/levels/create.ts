import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles-levels", {
  name: "create",
  aliases: ["c"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "level", type: "number", minimum: 1, maximum: 200 },
    { name: "roles", type: "...roles" },
  ] as const,
  execute: async function (message, args) {
    await db.levels.update(`${message.guildID}-${args.level}`, {
      guildID: message.guildID,
      roleIDs: args.roles.map((r) => r.id),
    });
    return botCache.helpers.reactSuccess(message);
  },
});
