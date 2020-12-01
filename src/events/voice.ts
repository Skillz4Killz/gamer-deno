import { botCache, cache } from "../../deps.ts";
import { db } from "../database/database.ts";

botCache.eventHandlers.voiceChannelJoin = async function (member, channelID) {
  if (member.bot) return;

  const channel = cache.channels.get(channelID);
  if (!channel) return;

  // Voice XP is vip guilds only
  if (!botCache.vipGuildIDs.has(channel.guildID)) return;

  db.xp.update(
    `${channel.guildID}-${member.id}`,
    { joinedVoiceAt: Date.now() },
  );
};

botCache.eventHandlers.voiceChannelLeave = async function (member, channelID) {
  if (!member) return;

  if (member.bot) return;

  const channel = cache.channels.get(channelID);
  if (!channel) return;

  const guild = cache.guilds.get(channel.guildID);
  if (!guild) return;

  if (!botCache.vipGuildIDs.has(channel.guildID)) return;

  const settings = await db.xp.get(`${channel.guildID}-${member.id}`);
  if (!settings?.joinedVoiceAt) return;

  // If the joined channel is the afk channel ignore.
  if (channelID === guild.afkChannelID) {
    return db.xp.update(
      `${channel.guildID}-${member.id}`,
      { joinedVoiceAt: 0 },
    );
  }

  // Calculate the amount of total minutes spent in this voice channel
  const totalMinutesInVoice = Math.round(
    (Date.now() - settings.joinedVoiceAt) / 1000 / 60,
  );
  const guildXPMultiplier = botCache.guildsXPPerMinuteVoice.get(
    channel.guildID,
  );

  // Update voice xp to the guild
  db.xp.update(
    `${channel.guildID}-${member.id}`,
    {
      joinedVoiceAt: 0,
      voiceXP: totalMinutesInVoice * (guildXPMultiplier || 1),
    },
  );

  // If more than 10 minutes they have fulfilled the mission
  if (totalMinutesInVoice >= 10) {
    botCache.helpers.completeMission(channel.guildID, member.id, `voice10min`);
  }
};

botCache.eventHandlers.voiceChannelSwitch = async function (
  member,
  channelID,
  oldChannelID,
) {
  const channel = cache.channels.get(channelID);
  if (!channel) return;

  if (!botCache.vipGuildIDs.has(channel.guildID)) return;

  const guild = cache.guilds.get(channel.guildID);
  if (!guild) return;

  // If the new channel is not afk channel then cancel
  if (channel.id !== guild.afkChannelID) return;

  // Since the user went to the afk channel we reset their xp
  db.xp.update(`${guild.id}-${member.id}`, { joinedVoiceAt: 0 });
};
