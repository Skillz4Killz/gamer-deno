import { botCache } from "../../../../mod.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import type { createSubcommand, sendResponse } from "../../../utils/helpers.ts";
import { guildsDatabase } from "../../../database/schemas/guilds.ts";

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
    const settings = await guildsDatabase.findOne({ guildID: message.guildID });
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
