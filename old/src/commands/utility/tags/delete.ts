import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("tag", {
  name: "delete",
  aliases: ["d"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "name", type: "string", lowercase: true }] as const,
  execute: async function (message, args) {
    // Delete from db
    await db.tags.deleteOne({ guildID: message.guildID, name: args.name });
    // Delete from cache
    botCache.tagNames.delete(`${message.guildID}-${args.name}`);
    return botCache.helpers.reactSuccess(message);
  },
});
