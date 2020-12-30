import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-logs", {
  name: "public",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "channel", type: "guildtextchannel" },
  ],
  execute: async function (message, args) {
    if (!args.channel.nsfw) return botCache.helpers.reactError(message);

    db.serverlogs.update(
      message.guildID,
      { publicChannelID: message.mentionChannelIDs[0] || "" },
    );
    await botCache.helpers.reactSuccess(message);
  },
});
