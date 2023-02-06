import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("labels", {
  name: "delete",
  aliases: ["d"],
  arguments: [{ name: "name", type: "string", lowercase: true }] as const,
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async (message, args) => {
    await db.labels.deleteOne({ name: args.name, guildID: message.guildID });

    return botCache.helpers.reactSuccess(message);
  },
});
