import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("modlog", {
  name: "edit",
  aliases: ["change", "update"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [
    { name: "id", type: "number", required: true },
    { name: "reason", type: "...string", required: true },
  ] as const,
  guildOnly: true,
  execute: async (message, args) => {
    await db.modlogs.updateOne(
      { guildID: message.guildID, modlogID: args.id },
      { reason: args.reason },
    );

    await botCache.helpers.reactSuccess(message);
  },
});
