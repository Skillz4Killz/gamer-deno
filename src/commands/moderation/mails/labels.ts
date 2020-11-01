import { botCache } from "../../../../cache.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createCommand, sendResponse } from "../../../utils/helpers.ts";

createCommand({
  name: "label",
  aliases: ["labels", "l"],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "content", type: "...string" },
  ],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args: MailArgs, guild) => {
    const labels = await db.labels.findMany({ guildID: message.guildID }, true);
    if (!labels.length) return botCache.helpers.reactError(message);

    sendResponse(message, labels.map((label) => label.name).join("\n"));
  },
});

interface MailArgs {
  content: string;
}
