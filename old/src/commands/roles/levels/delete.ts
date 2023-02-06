import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles-levels", {
  name: "delete",
  aliases: ["d"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "level", type: "number", minimum: 1, maximum: 200 }] as const,
  execute: async function (message, args) {
    await db.levels.delete(`${message.guildID}-${args.level}`);
    return botCache.helpers.reactSuccess(message);
  },
});
