import { botCache, cache, memberIDHasPermission } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-logs", {
  name: "mod",
  description: "https://gamer.mod.land/docs/logs.html",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
    { name: "channelID", type: "snowflake", required: false },
  ] as const,
  execute: async function (message, args) {
    console.log("cmd ran");
    if (args.channel && !args.channel.nsfw) {
      return botCache.helpers.reactError(message);
    }

    if (args.channelID) {
      // If a snowflake is provided make sure this is a vip server
      if (!botCache.vipGuildIDs.has(message.guildID)) {
        return botCache.helpers.reactError(message, true);
      }
      const channel = cache.channels.get(args.channelID);
      if (!channel?.nsfw) return botCache.helpers.reactError(message);

      // VIP's can set channel ids from other server, make sure the user is an admin on other server
      if (!(await memberIDHasPermission(message.author.id, channel.guildID, ["ADMINISTRATOR"]))) {
        return botCache.helpers.reactError(message);
      }

      await db.serverlogs.update(message.guildID, {
        modChannelID: args.channelID,
      });
      return botCache.helpers.reactSuccess(message);
    }

    await db.serverlogs.update(message.guildID, {
      modChannelID: args.channel?.id || "",
    });
    await botCache.helpers.reactSuccess(message);
  },
});
