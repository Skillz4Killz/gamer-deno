import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("tag", {
  name: "uninstall",
  aliases: ["ui", "ud", "undownload"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "module", type: "string", lowercase: true }] as const,
  execute: async function (message, args) {
    // Check the module and convert it to a server id
    const serverID = botCache.modules.get(args.module) || args.module;
    // Add this module to the database
    await db.modules.delete(`${message.guildID}-${serverID}`);
    // Alerts the user that it was completed
    return botCache.helpers.reactSuccess(message);
  },
});
