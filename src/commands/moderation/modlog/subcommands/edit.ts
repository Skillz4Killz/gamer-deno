import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { botCache } from "../../../../../cache.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("modlog", {
  name: "edit",
  aliases: ["change", "update"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [
    { name: "id", type: "number", required: true },
    { name: "reason", type: "...string", required: true },
  ],
  guildOnly: true,
  execute: async (message, args: ModlogEditArgs) => {
    db.modlogs.updateOne(
      { guildID: message.guildID, modlogID: args.id },
      { reason: args.reason },
    );

    botCache.helpers.reactSuccess(message);
  },
});

interface ModlogEditArgs {
  id: number;
  reason: string;
}
