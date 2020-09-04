import { botCache } from "../../../../mod.ts";
import { labelsDatabase } from "../../../database/schemas/labels.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { sendResponse } from "../../../utils/helpers.ts";

botCache.commands.set("label", {
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
    const labels = await labelsDatabase.find({ guildID: message.guildID })
    if (!labels.length) return botCache.helpers.reactError(message)

    sendResponse(message, labels.map(label => label.name).join('\n'))
  },
});

interface MailArgs {
  content: string;
}
