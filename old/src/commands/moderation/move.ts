import { botCache, botHasChannelPermissions, editMember, hasChannelPermissions } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "move",
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  arguments: [
    { name: "channel", type: "voicechannel" },
    { name: "new", type: "voicechannel", required: false },
  ] as const,
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message, args, guild) {
    if (
      !(await botHasChannelPermissions(args.channel.id, ["MOVE_MEMBERS"])) ||
      !(await hasChannelPermissions(args.channel.id, message.author.id, ["MOVE_MEMBERS"]))
    ) {
      return botCache.helpers.reactError(message);
    }
    // If a valid new channel was provided we simply move all the users in the channel over
    if (args.new) {
      if (!(await botHasChannelPermissions(args.new.id, ["MOVE_MEMBERS"]))) {
        return botCache.helpers.reactError(message);
      }

      guild?.voiceStates.forEach(async (vs) => {
        if (vs.channelID !== args.channel.id) return;
        await editMember(message.guildID, vs.userID, {
          channel_id: args.new!.id,
        });
      });
    } else {
      if (!message.mentions.length) return botCache.helpers.reactError(message);
      message.mentions.forEach(async (id) => {
        if (!guild?.voiceStates.has(id)) return;
        await editMember(message.guildID, id, { channel_id: args.channel.id });
      });
    }

    return botCache.helpers.reactSuccess(message);
  },
});
