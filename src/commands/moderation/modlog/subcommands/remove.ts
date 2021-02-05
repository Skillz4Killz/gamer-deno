import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("modlog", {
  name: "remove",
  aliases: ["delete"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [{ name: "id", type: "number", required: true }] as const,
  guildOnly: true,
  execute: async (message, args) => {
    await db.modlogs.deleteOne({ guildID: message.guildID, modlogID: args.id });
    return botCache.helpers.reactSuccess(message);
  },
});
