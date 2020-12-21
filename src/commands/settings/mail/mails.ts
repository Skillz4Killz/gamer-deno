import { botCache } from "../../../../deps.ts";
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
  ] as const,
  execute: async (message) => {
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
