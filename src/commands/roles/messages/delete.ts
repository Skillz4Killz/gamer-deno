import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles-messages", {
  name: "delete",
  aliases: ["d"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "role", type: "role" },
  ] as const,
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args) => {
    db.rolemessages.delete(args.role.id);
    await botCache.helpers.reactSuccess(message);
  },
});
