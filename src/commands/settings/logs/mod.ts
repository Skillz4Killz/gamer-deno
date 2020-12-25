import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-logs", {
  name: "mod",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
  ],
  execute: function (message, args) {
    if (!args.channel.nsfw) return botCache.helpers.reactError(message);

    db.serverlogs.update(
      message.guildID,
      { modChannelID: args.channel?.id || "" },
    );
    botCache.helpers.reactSuccess(message);
  },
});
