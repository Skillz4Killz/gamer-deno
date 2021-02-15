import { botCache, cache, memberIDHasPermission } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("settings", {
  name: "analytics",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
    { name: "channelID", type: "snowflake", required: false },
  ] as const,
  execute: async function (message, args) {
    // A channel in the same guild was provided
    if (args.channel) {
      await db.guilds.update(message.guildID, {
        analyticsChannelID: args.channel.id,
      });
      return botCache.helpers.reactSuccess(message);
    }

    // No channel nor id was provided so disable
    if (!args.channelID) {
      await db.guilds.update(message.guildID, { analyticsChannelID: "" });
      return botCache.helpers.reactSuccess(message);
    }

    // A channel id was provided, for vip users only
    const channel = cache.channels.get(args.channelID);
    if (!channel) return botCache.helpers.reactError(message);

    // Make sure this user has admin perms on other server
    const hasAdmin = await memberIDHasPermission(message.author.id, channel.guildID, ["ADMINISTRATOR"]);
    if (!hasAdmin) return botCache.helpers.reactError(message);

    // Update settings, all requirements passed
    await db.guilds.update(message.guildID, {
      analyticsChannelID: args.channelID,
    });
    return botCache.helpers.reactSuccess(message);
  },
});
