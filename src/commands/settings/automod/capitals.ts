import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-automod", {
  name: "capitals",
  aliases: ["caps"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "enabled", type: "boolean", required: false, defaultValue: true },
    { name: "percentage", type: "number", required: false },
  ] as const,
  execute: async function (message, args) {
    if (args.percentage) {
      if (args.percentage > 100 || args.percentage < 40) {
        return botCache.helpers.reactError(message);
      }

      await db.guilds.update(message.guildID, {
        capitalPercentage: args.percentage,
      });
      return botCache.helpers.reactSuccess(message);
    }

    // Enabled we set default to 50 and disabled we set to 100 to disable it
    await db.guilds.update(message.guildID, {
      capitalPercentage: args.enabled ? 50 : 100,
    });
    return botCache.helpers.reactSuccess(message);
  },
});
