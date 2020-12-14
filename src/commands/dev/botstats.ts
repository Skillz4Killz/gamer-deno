import { botCache, botGatewayData, botID, cache } from "../../../deps.ts";
import { Embed } from "./../../utils/Embed.ts";
import {
  createCommand,
  humanizeMilliseconds,
  sendEmbed,
  sendResponse,
} from "../../utils/helpers.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";

createCommand({
  name: "botstats",
  guildOnly: true,
  permissionLevels: [
    PermissionLevels.BOT_OWNER,
    PermissionLevels.BOT_DEVS,
    PermissionLevels.BOT_SUPPORT,
  ],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  execute: async function (message, args, guild) {
    let totalMemberCount = 0;
    let cachedMemberCount = 0;

    for (const guild of cache.guilds.values()) {
      totalMemberCount += guild.memberCount;
    }

    for (const member of cache.members.values()) {
      cachedMemberCount += member.guilds.size;
    }

    const firstEmbed = new Embed()
      .setColor("random")
      .addField(
        "Servers",
        botCache.helpers.cleanNumber(cache.guilds.size + botCache.dispatchedGuildIDs.size),
        true,
      )
      .addField("Dispatched", botCache.helpers.cleanNumber(botCache.dispatchedGuildIDs.size), true)
      .addField(
        "Members",
        totalMemberCount.toLocaleString(),
        true,
      )
      .addField(
        "Cached Members",
        cachedMemberCount.toLocaleString(),
        true,
      )
      .addField(
        "Channels",
        (cache.channels.size + botCache.dispatchedChannelIDs.size)
          .toLocaleString(),
        true,
      )
      .setTimestamp();

    sendEmbed(message.channelID, firstEmbed);

    const stats = await db.client.get(botID);
    if (!stats) {
      await db.client.create(botID);
      return sendResponse(message, "Stats table didn't return any data.");
    }

    const sessionStats = [
      `**Remaining:** ${botGatewayData.session_start_limit.remaining.toLocaleString()}`,
      `**Resets After:** ${
        humanizeMilliseconds(botGatewayData.session_start_limit.reset_after)
      }`,
      `**Total:** ${botGatewayData.session_start_limit.total.toLocaleString()}`,
      `**Shards:** ${botGatewayData.shards}`,
    ];

    const messageStats = [
      `**Processed:** ${
        (BigInt(stats.messagesProcessed || "0")).toLocaleString()
      }`,
      `**Sent:** ${(BigInt(stats.messagesSent || "0")).toLocaleString()}`,
      `**Deleted:** ${(BigInt(stats.messagesDeleted || "0")).toLocaleString()}`,
      `**Edited:** ${(BigInt(stats.messagesEdited || "0")).toLocaleString()}`,
      `**Commands:** ${(BigInt(stats.commandsRan || "0")).toLocaleString()}`,
    ];

    const reactionStats = [
      `**Added:** ${
        (BigInt(stats.reactionsAddedProcessed || "0")).toLocaleString()
      }`,
      `**Removed:** ${
        (BigInt(stats.reactionsRemovedProcessed || "0")).toLocaleString()
      }`,
    ];

    // Show dev related stats
    const embed = new Embed()
      .setColor("random")
      .addField("Session Start Limit", sessionStats.join("\n"), true)
      .addField("Messages", messageStats.join("\n"), true)
      .addField("Reactions", reactionStats.join("\n"), true)
      .setTimestamp();

    return sendEmbed(message.channelID, embed);
  },
});
