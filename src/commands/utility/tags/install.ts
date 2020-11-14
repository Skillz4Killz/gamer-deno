import { botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("tags", {
  name: "install",
  aliases: ["i", "d", "download"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "module", type: "string", lowercase: true },
  ],
  execute: async function (message, args: TagInstallArgs) {
    // Check the module and convert it to a server id
    const serverID = botCache.modules.get(args.module) || args.module;
    // Validate it is a guild id
    if (!cache.guilds.has(serverID)) {
      return botCache.helpers.reactError(message);
    }
    // Add this module to the database
    db.modules.update(
      `${message.guildID}-${serverID}`,
      { sourceGuildID: serverID, guildID: message.guildID },
    );
    // Alerts the user that it was completed
    botCache.helpers.reactSuccess(message);
  },
});

interface TagInstallArgs {
  module: string;
}
