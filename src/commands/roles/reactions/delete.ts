import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles-reactions", {
  name: "delete",
  aliases: ["del", "d"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "name", type: "string", lowercase: true },
  ] as const,
  execute: async function (message, args) {
    db.reactionroles.deleteOne({ name: args.name, guildID: message.guildID });
    botCache.helpers.reactSuccess(message);
  },
});
