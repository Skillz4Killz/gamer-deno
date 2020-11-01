import { botCache } from "../../../../cache.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand, sendResponse } from "../../../utils/helpers.ts";
import { db } from "../../../database/database.ts";

createSubcommand("settings", {
  name: "mails",
  aliases: ["mail"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "enable", type: "boolean", required: false },
  ],
  execute: async (message, args, guild) => {
    const settings = await db.guilds.get(message.guildID);
    if (!settings) return botCache.helpers.reactError(message);

    sendResponse(
      message,
      [
        `${settings.mailCategoryID}`,
      ].join("\n"),
    );
  },
});

interface SettingsMailArgs {
  enable?: boolean;
}
