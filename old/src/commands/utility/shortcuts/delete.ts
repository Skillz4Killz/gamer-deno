import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("shortcut", {
  name: "delete",
  aliases: ["d"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "name", type: "string", lowercase: true }] as const,
  execute: async function (message, args) {
    await db.shortcuts.delete(`${message.guildID}-${args.name}`);
    return botCache.helpers.reactSuccess(message);
  },
});
