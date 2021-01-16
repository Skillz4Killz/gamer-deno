// DEV PURPOSES ONLY
import { deleteChannel } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `ddb`,
  permissionLevels: [PermissionLevels.BOT_OWNER],
  execute: async function (message, args, guild) {
    message.guild?.channels.forEach(async (channel) => {
      if (channel.id === message.channelID) return;

      await deleteChannel(message.guildID, channel.id);
    });
  },
});
