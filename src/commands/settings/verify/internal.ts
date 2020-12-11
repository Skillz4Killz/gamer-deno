import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-verify", {
  name: "internal",
  permissionLevels: [PermissionLevels.ADMIN],
  vipServerOnly: true,
  arguments: [
    { name: "enabled", type: "boolean" },
  ] as const,
  execute: function (message, args) {
    db.guilds.update(
      message.guildID,
      { discordVerificationStrictnessEnabled: args.enabled },
    );
    botCache.helpers.reactSuccess(message);
  },
});
