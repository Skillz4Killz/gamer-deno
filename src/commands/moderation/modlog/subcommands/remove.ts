import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("modlog", {
  name: "remove",
  aliases: ["delete"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [{ name: "id", type: "number", required: true }] as const,
  guildOnly: true,
  execute: async (message, args) => {
    db.modlogs.deleteOne({ guildID: message.guildID, modlogID: args.id });
    await botCache.helpers.reactSuccess(message);
  },
});
