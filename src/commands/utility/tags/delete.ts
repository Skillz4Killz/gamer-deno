import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("tags", {
  name: "delete",
  aliases: ["d"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
  ],
  execute: async function (message, args: TagDeleteArgs) {
    // Delete from db
    db.tags.deleteOne({ guildID: message.guildID, name: args.name });
    // Delete from cache
    botCache.tagNames.delete(`${message.guildID}-${args.name}`);
    botCache.helpers.reactSuccess(message);
  },
});

interface TagDeleteArgs {
  name: string;
}
