import { botCache } from "../../../cache.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { deleteMessages, getMessages } from "../../../deps.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `purge`,
  aliases: [`nuke`, `prune`, `clear`],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["MANAGE_MESSAGES"],
  userChannelPermissions: ["MANAGE_MESSAGES"],
  arguments: [
    { name: "amount", type: "number", defaultValue: 20 },
    {
      name: "filter",
      type: "string",
      literals: ["links", "bots", "invites", "upload", "images"],
      required: false,
    },
    { name: "userID", type: "snowflake", required: false },
  ],
  guildOnly: true,
  execute: async function (message, args: PurgeArgs, guild) {
    const messages = await getMessages(message.channelID, { limit: 100 }).catch(
      () => undefined,
    );
    if (!messages) return botCache.helpers.reactError(message);

    const now = Date.now();
    const maxAge = botCache.constants.milliseconds.WEEK * 2;

    const filteredMessages = messages.filter((msg) => {
      // Always delete the nuke command message
      if (message.id === msg.id) return true;
      // Discord does not allow deleting messages over 2 weeks old
      if (now - msg.timestamp > maxAge) return false;
      // if users were mentioned we remove their messages
      if (message.mentions.length) {
        return message.mentions.some((id) => id === msg.author.id);
      }
      // If the filter is a user ID useful when user is gone and cant @
      if (args.userID === msg.author.id) return true;
      // Check the filter types
      if (args.filter === `links`) {
        return /https?:\/\/[^ /.]+\.[^ /.]+/.test(msg.content);
      }
      if (args.filter === `invites`) {
        return /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/
          .test(msg.content);
      }
      if (args.filter === `bots`) return msg.author.bot;
      if (args.filter === `upload` || args.filter === "images") {
        return msg.attachments.length;
      }
      return true;
    });

    const messagesToDelete = filteredMessages.splice(0, args.amount + 1);
    deleteMessages(message.channelID, messagesToDelete.map((m) => m.id)).catch(
      () => undefined,
    );
  },
});

interface PurgeArgs {
  amount: number;
  filter?: string;
  userID?: string;
}
