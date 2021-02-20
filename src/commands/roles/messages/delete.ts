import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles-messages", {
  name: "delete",
  aliases: ["d"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "id", type: "snowflake" }] as const,
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args) => {
    await db.rolemessages.delete(args.id);
    return botCache.helpers.reactSuccess(message);
  },
});
