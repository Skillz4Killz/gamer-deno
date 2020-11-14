import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("tags", {
  name: "uninstall",
  aliases: ["ui", "ud", "undownload"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "module", type: "string", lowercase: true },
  ],
  execute: async function (message, args: TagInstallArgs) {
    // Check the module and convert it to a server id
    const serverID = botCache.modules.get(args.module) || args.module;
    // Add this module to the database
    db.modules.delete(`${message.guildID}-${serverID}`);
    // Alerts the user that it was completed
    botCache.helpers.reactSuccess(message);
  },
});

interface TagInstallArgs {
  module: string;
}
