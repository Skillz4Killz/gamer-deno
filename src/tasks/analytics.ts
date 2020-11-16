/**
 * 1. Amount of messages sent
 * 2. Amount of members joined
 * 3. Amount of member left
 * 4. Net members joined/left
 * 5. Amount of messages in each channel
 * 6. Amount of messages by each user
 * 7. Amount of joins in a voice channel
 * 8. Amount of times a custom emoji was used in a message
 */

import {
  botCache,
  cache,
  ChannelTypes,
  Guild,
  sendMessage,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import {
  AggregatedAnalyticSchema,
  AnalyticSchema,
} from "../database/schemas.ts";
import { translate } from "../utils/i18next.ts";

export const analyticsMessages = new Map<string, number>();
export const analyticsMemberJoin = new Map<string, number>();
export const analyticsMemberLeft = new Map<string, number>();
export const analyticsDetails = new Map<string, number>();

botCache.tasks.set("analytics", {
  name: "analytics",
  interval: botCache.constants.milliseconds.DAY,
  execute: function () {
    const date = new Date();

    botCache.vipGuildIDs.forEach(async (id) => {
      const guild = cache.guilds.get(id);
      if (!guild) return;

      const analytics = await db.analytics.get(id);
      if (!analytics) return;

      // Delete the analytics now so it begins counting for tmrw from scratch.
      db.analytics.delete(id);

      const texts = [
        `**${translate(id, "strings:ANALYTICS_DAILY")}**`,
      ];

      const todaysData = processData(guild, analytics);
      texts.push(...todaysData.texts);

      const payload: Partial<AggregatedAnalyticSchema> = {
        guildID: id,
        messageCount: analytics.messageCount,
        membersJoined: analytics.membersJoined,
        membersLeft: analytics.membersLeft,
      };

      for (
        const data of [
          ...todaysData.textChannelsData,
          ...todaysData.voiceChannelsData,
          ...todaysData.emojisData,
        ]
      ) {
        payload[data![0]!] = data![1];
      }

      const todaysDate = date.getDate();
      const today = todaysDate.toString().padStart(2, "0");
      // Todays aggregated data
      await db.aggregatedanalytics.update(`${id}-${today}`, payload);

      // Find all older data for this guild
      const aggregated = await db.aggregatedanalytics.findMany(
        { guildID: id },
        true,
      );

      const weeklyText: AnalyticSchema = {
        id: "",
        membersJoined: 0,
        membersLeft: 0,
        messageCount: 0,
      };
      const monthlyText: AnalyticSchema = {
        id: "",
        membersJoined: 0,
        membersLeft: 0,
        messageCount: 0,
      };

      function calculateDate(d: number) {
        return new Date(Date.now() - d * 24 * 60 * 60 * 1000).getDate()
          .toString()
          .padStart(2, "0");
      }

      const week = [
        today,
        calculateDate(1),
        calculateDate(2),
        calculateDate(3),
        calculateDate(4),
        calculateDate(5),
        calculateDate(6),
      ];

      for (const data of aggregated) {
        for (const key of Object.keys(data)) {
          const value = data[key];
          if (typeof value === "string") continue;

          // Only week data
          if (week.some((day) => data.id.endsWith(day))) {
            weeklyText[key] = ((weeklyText[key] as number) || 0) + value;
          }

          // All days should be aggregated for monthly stats
          monthlyText[key] = ((monthlyText[key] as number) || 0) + value;
        }
      }

      texts.push(
        "",
        `**${translate(id, "strings:ANALYTICS_WEEKLY")}**`,
        ...processData(guild, weeklyText).texts,
        "",
        `**${translate(id, "strings:ANALYTICS_MONTHLY")}**`,
        ...processData(guild, monthlyText).texts,
      );

      // Everything was calculated time to send everything
      const responses = botCache.helpers.chunkStrings(texts);
      const settings = await db.guilds.get(guild.id);
      if (!settings) return;

      for (const response of responses) {
        sendMessage(settings.analyticsChannelID, response);
      }
    });
  },
});

function processData(guild: Guild, data: AnalyticSchema) {
  const texts = [
    translate(
      guild.id,
      "strings:ANALYTICS_MESSAGE_COUNT",
      { amount: data.messageCount },
    ),
    translate(
      guild.id,
      "strings:ANALYTICS_MEMBERS_JOINED",
      { amount: data.membersJoined },
    ),
    translate(
      guild.id,
      "strings:ANALYTICS_MEMBERS_LEFT",
      { amount: data.membersLeft },
    ),
    translate(
      guild.id,
      "strings:ANALYTICS_MEMBERS_NET",
      { amount: data.membersJoined - data.membersLeft },
    ),
    "",
    translate(guild.id, "strings:ANALYTICS_CHANNELS"),
  ];

  const textChannelsData = cache.channels.map((channel) => {
    if (channel.guildID !== guild.id) return;
    if (
      channel.type !== ChannelTypes.GUILD_TEXT ||
      channel.type !== ChannelTypes.GUILD_NEWS
    ) {
      return;
    }
    return [guild.id, data[channel.id] || 0];
  }).filter((x) => x).sort((a, b) => Number(b![1]) - Number(a![1]));

  for (const data of textChannelsData) {
    texts.push(`🗨️ <#${data![0]!}> ${data![1]!}`);
  }

  const voiceChannelsData = cache.channels.map((channel) => {
    if (channel.guildID !== guild.id) return;
    if (channel.type !== ChannelTypes.GUILD_VOICE) return;
    return [guild.id, data[channel.id] || 0];
  }).filter((x) => x).sort((a, b) => Number(b![1]) - Number(a![1]));

  for (const data of voiceChannelsData) {
    texts.push(`🎤 ${cache.channels.get(data![0] as string)?.name} **${data![1]}**`);
  }

  texts.push("", translate(guild.id, "strings:ANALYTICS_EMOJIS"));

  const emojisData = guild.emojis.map((emoji) => {
    if (!emoji.id) return;
    return [
      `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`,
      data[emoji.id] || 0,
    ];
  }).filter((x) => x).sort((a, b) => Number(b![1]) - Number(a![1]));

  for (const data of emojisData) {
    texts.push(`${data![0]} **${data![1]}**`);
  }

  return {
    texts,
    textChannelsData,
    voiceChannelsData,
    emojisData,
  };
}

botCache.tasks.set("analyticslocal", {
  name: "analyticslocal",
  interval: botCache.constants.milliseconds.MINUTE * 5,
  execute: function () {
    // Clone the data
    const messageData = new Map([...analyticsMessages.entries()]);
    const joinData = new Map([...analyticsMemberJoin.entries()]);
    const leftData = new Map([...analyticsMemberLeft.entries()]);

    // Clear the map
    analyticsMessages.clear();
    analyticsMemberJoin.clear();
    analyticsMemberLeft.clear();

    // Update db
    messageData.forEach(async (amount, id) => {
      const analytics = await db.analytics.get(id);
      db.analytics.update(
        id,
        { messageCount: (analytics?.messageCount || 0) + amount },
      );
    });

    joinData.forEach(async (amount, id) => {
      const analytics = await db.analytics.get(id);
      db.analytics.update(
        id,
        { membersJoined: (analytics?.membersJoined || 0) + amount },
      );
    });

    leftData.forEach(async (amount, id) => {
      const analytics = await db.analytics.get(id);
      db.analytics.update(
        id,
        { membersLeft: (analytics?.membersLeft || 0) + amount },
      );
    });
  },
});
