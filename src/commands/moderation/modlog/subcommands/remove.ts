import type { createSubcommand } from "../../../../utils/helpers.ts";
import type { PermissionLevels } from "../../../../types/commands.ts";
import type { modlogsDatabase } from "../../../../database/schemas/modlogs.ts";
import { botCache } from "../../../../../mod.ts";

createSubcommand("modlog", {
  name: "remove",
  aliases: ["delete"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [{ name: "id", type: "number", required: true }],
  guildOnly: true,
  execute: async (message, args: ModlogRemoveArgs) => {
    modlogsDatabase.deleteOne({ guildID: message.guildID, modlogID: args.id });
    botCache.helpers.reactSuccess(message);
  },
});

interface ModlogRemoveArgs {
  id: number;
}
