import { botCache } from "../../../cache.ts";
import { ChannelTypes, guildIconURL } from "../../../deps.ts";
import { createCommand, sendResponse } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";
import { Embed } from "../../utils/Embed.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { db } from "../../database/database.ts";

createCommand({
  name: `analyze`,
  aliases: ["analytics"],
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async function (message, _args, guild) {
    if (!guild) return;

    const settings = await botCache.helpers.upsertGuild(guild.id);
    if (!settings) return botCache.helpers.reactError(message);

    // Alert the user that this can take time
    sendResponse(message, translate(message.guildID, `vip/analyze:PATIENCE`));

    // Fetch all analytics for this guild
    const allAnalyticData = await db.analytics.findMany(
      { guildID: message.guildID },
      true,
    );

    let totalMessages = 0;
    let membersJoined = 0;
    let membersLeft = 0;

    const channelMessages = new Map<string, number>();
    const userMessages = new Map<string, number>();

    const currentMonth = new Date().getMonth();

    for (const data of allAnalyticData) {
      // If not current month skip this. Will be aggregated and removed when processed.
      if (currentMonth !== new Date(data.timestamp).getMonth()) continue;

      if (data.type === "MESSAGE_CREATE") {
        totalMessages++;

        const channelCount = channelMessages.get(data.channelID);
        channelMessages.set(
          data.channelID,
          channelCount ? channelCount + 1 : 1,
        );

        const userCount = userMessages.get(data.userID);
        userMessages.set(data.userID, userCount ? userCount + 1 : 1);
      }

      if (data.type === "MEMBER_ADDED") {
        membersJoined++;
      }

      if (data.type === "MEMBER_REMOVED") {
        membersLeft++;
      }
    }

    const serverlogChannelIDs = [
      settings.modlogsChannelID,
      settings.publiclogsChannelID,
      settings.botChannelID,
      settings.channelsChannelID,
      settings.emojisChannelID,
      settings.membersChannelID,
      settings.messagesChannelID,
      settings.rolesChannelID,
    ];

    const relevantChannels = guild.channels
      .filter((channel) => {
        // Skip non-text channels
        if (
          channel.type !== ChannelTypes.GUILD_NEWS ||
          channel.type !== ChannelTypes.GUILD_TEXT
        ) {
          return false;
        }

        // TODO: Enable this when we have added these features.
        // Skip verify channels
        // if (channel.parentID === guildSettings.verify.categoryID) return false;
        // Skip mail channels
        // if (channel.parentID === guildSettings.mails.categoryID) return false;
        // Skip server log channels
        if (serverlogChannelIDs.includes(channel.id)) return false;

        return true;
      })
      .map((channel) => channel.id);

    const topChannels = [...channelMessages.keys()]
      .filter((id) => guild.channels.has(id))
      .sort((a, b) => channelMessages.get(b)! - channelMessages.get(a)!)
      .slice(0, 10);

    const leastActiveChannels = relevantChannels
      .sort((a, b) =>
        (channelMessages.get(a) || 0) - (channelMessages.get(b) || 0)
      )
      .slice(0, 10);

    const topUsers = [...userMessages.keys()].sort((a, b) =>
      userMessages.get(b)! - userMessages.get(a)!
    ).slice(0, 10);

    const NONE = translate(message.guildID, `common:NONE`);

    const embed = new Embed()
      .setAuthor(
        guild.name,
        guildIconURL(guild),
      )
      .addField(
        translate(message.guildID, `vip/analyze:TOTAL_MESSAGES`),
        totalMessages.toString(),
        true,
      )
      .addField(
        translate(message.guildID, `vip/analyze:MEMBERS_STATS`),
        translate(message.guildID, `vip/analyze:MEMBER_JOIN_LEAVE`, {
          joined: membersJoined,
          left: membersLeft,
          net: membersJoined - membersLeft,
        }),
        true,
      )
      .addBlankField()
      .addField(
        translate(message.guildID, `vip/analyze:TOP_CHANNELS`),
        topChannels.map((id) => `<#${id}> ${channelMessages.get(id)!}`).join(
          "\n",
        ) || NONE,
        true,
      )
      .addField(
        translate(message.guildID, `vip/analyze:INACTIVE_CHANNELS`),
        leastActiveChannels.map((id) =>
          `<#${id}> ${channelMessages.get(id) || 0}`
        ).join("\n") || NONE,
        true,
      )
      .addField(
        translate(message.guildID, `vip/analyze:TOP_USERS`),
        topUsers.map((id) => `<@!${id}> ${userMessages.get(id)!}`).join("\n") ||
          NONE,
        true,
      )
      .setTimestamp();

    return sendResponse(message, { embed });
  },
});
