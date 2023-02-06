import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-feedback-idea", {
  name: "channel",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [{ name: "channel", type: "guildtextchannel", required: false }],
  execute: async (message, args) => {
    await db.guilds.update(message.guildID, {
      ideaChannelID: args.channel?.id,
    });
    return botCache.helpers.reactSuccess(message);
  },
});
