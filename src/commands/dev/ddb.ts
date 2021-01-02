// DEV PURPOSES ONLY
import { deleteChannel } from "https://raw.githubusercontent.com/discordeno/discordeno/master/src/api/handlers/guild.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `ddb`,
  permissionLevels: [PermissionLevels.BOT_OWNER],
  execute: async function (message, args, guild) {
    message.guild?.channels.forEach(channel => {
      if (channel.id === message.channelID) return;
      
      deleteChannel(message.guildID, channel.id);
    })
  },
});
