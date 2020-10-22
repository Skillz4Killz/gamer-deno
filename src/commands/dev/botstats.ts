import { botCache } from "../../../mod.ts";
import { Embed } from "./../../utils/Embed.ts";
import { botGatewayData, botID } from "../../../deps.ts";
import {
  createCommand,
  humanizeMilliseconds,
  sendEmbed,
  sendResponse,
} from "../../utils/helpers.ts";
import { db } from "../../database/database.ts";

createCommand({
  name: "botstats",
  guildOnly: true,
  execute: async function (message, args, guild) {
    // Execute the normal stats command
    botCache.commands.get("stats")?.execute?.(message, args, guild);

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
