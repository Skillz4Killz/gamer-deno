import { cache, Channel, memberIDHasPermission } from "../../../../deps.ts";
import { botCache } from "../../../../mod.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-feedback", {
  name: "rejectedchannel",
  aliases: ["rejected", "rchannel"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
    { name: "channelID", type: "snowflake", required: false },
  ],
  execute: async (message, args: SettingsFeedbackRejectedchannelArgs) => {
    // A channel in the same guild was provided
    if (args.channel) {
      db.guilds.update(message.guildID, { rejectedChannelID: args.channel.id });
      return botCache.helpers.reactSuccess(message);
    }

    // No channel nor id was provided so disable
    if (!args.channelID) {
      db.guilds.update(message.guildID, { rejectedChannelID: "" });
      return botCache.helpers.reactSuccess(message);
    }

    // A channel id was provided, for vip users only
    const channel = cache.channels.get(args.channelID);
    if (!channel) return botCache.helpers.reactError(message);

    // Make sure this guild is VIP
    if (!botCache.vipGuildIDs.has(channel.guildID)) {
      return botCache.helpers.reactError(message, true);
    }

    // Make sure this user has admin perms on other server
    const hasAdmin = await memberIDHasPermission(
      message.author.id,
      channel.guildID,
      ["ADMINISTRATOR"],
    );
    if (!hasAdmin) return botCache.helpers.reactError(message);

    // Update settings, all requirements passed
    db.guilds.update(message.guildID, { rejectedChannelID: args.channelID });
    return botCache.helpers.reactSuccess(message);
  },
});

interface SettingsFeedbackRejectedchannelArgs {
  channel?: Channel;
  channelID?: string;
}
