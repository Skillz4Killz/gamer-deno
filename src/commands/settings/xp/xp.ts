import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings", {
  name: "xp",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "enabled", type: "boolean" },
  ] as const,
  execute: function (message, args) {
    db.guilds.update(message.guildID, { xpEnabled: args.enabled });
    botCache.helpers.reactSuccess(message);
  },
});
