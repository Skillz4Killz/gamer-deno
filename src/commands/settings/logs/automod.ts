import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-logs", {
  name: "automod",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "channel", type: "guildtextchannel" },
  ],
  execute: async function (message, args) {
    if (!args.channel.nsfw) return botCache.helpers.reactError(message);

    await db.serverlogs.update(
      message.guildID,
      { automodChannelID: message.mentionChannelIDs[0] || "" },
    );
    await botCache.helpers.reactSuccess(message);
  },
});
