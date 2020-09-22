import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import type { modlogsDatabase } from "../../../../database/schemas/modlogs.ts";
import { botCache } from "../../../../../mod.ts";

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
    modlogsDatabase.updateOne(
      { guildID: message.guildID, modlogID: args.id },
      { $set: { reason: args.reason } },
    );

    botCache.helpers.reactSuccess(message);
  },
});

interface ModlogEditArgs {
  id: number;
  reason: string;
}
