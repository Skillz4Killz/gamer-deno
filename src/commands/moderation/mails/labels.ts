import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "label",
  aliases: ["labels", "l"],
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message) => {
    const labels = await db.labels.findMany({ guildID: message.guildID }, true);
    if (!labels.length) return botCache.helpers.reactError(message);

    return message.reply(labels.map((label) => label.name).join("\n"));
  },
});
