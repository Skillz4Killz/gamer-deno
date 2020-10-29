import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { botCache } from "../../../../../cache.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("modlog", {
  name: "remove",
  aliases: ["delete"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [{ name: "id", type: "number", required: true }],
  guildOnly: true,
  execute: async (message, args: ModlogRemoveArgs) => {
    db.modlogs.deleteOne({ guildID: message.guildID, modlogID: args.id });
    botCache.helpers.reactSuccess(message);
  },
});

interface ModlogRemoveArgs {
  id: number;
}
