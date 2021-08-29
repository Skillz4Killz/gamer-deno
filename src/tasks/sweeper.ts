import { botCache, botID, cache, cacheHandlers, Member } from "../../deps.ts";
import { cachedSettingsAutomod } from "../monitors/automod.ts";

botCache.tasks.set(`sweeper`, {
  name: `sweeper`,
  interval: botCache.constants.milliseconds.MINUTE * 5,
  execute: async function () {
    const now = Date.now();
    // Delete presences from the bots cache.
    cacheHandlers.clear("presences");
    cachedSettingsAutomod.clear();
    botCache.recentRoleMessages.clear();
    botCache.recentGiveawayReactors.clear();
    botCache.recentLogs.clear();
    botCache.recentWelcomes.clear();

    // const vipIDs = [...botCache.vipGuildIDs.values()];

    cache.members.forEach(async function (member) {
      if (member.id === botID) return;

      // Delete any member who has not been active in the last 30 minutes and is not currently in a voice channel
      const lastActive = botCache.memberLastActive.get(member.id);
      // If the user is active recently
      if (lastActive && now - lastActive < botCache.constants.milliseconds.MINUTE * 30) {
        return;
      }

      // Has a vip guild
      // if (vipIDs.some((id) => member.guilds.has(id))) {
      //   return;
      // }

      cache.members.delete(member.id);
      botCache.memberLastActive.delete(member.id);
    });

    // // For every guild, we will clean the cache
    // cache.guilds.forEach(async (guild) => {
    //   // Delete presences from the guild caches.
    //   guild.presences.clear();
    // });

    // For every, message we will delete if necessary
    cache.messages.forEach(async (message) => {
      // DM messages arent needed
      if (!message.guildID) {
        return cache.messages.delete(message.id);
      }

      if (
        botCache.reactionRoleMessageIDs.has(message.id) ||
        botCache.giveawayMessageIDs.has(message.id) ||
        botCache.feedbackChannelIDs.has(message.channelID) ||
        botCache.pollMessageIDs.has(message.id)
      ) {
        return;
      }

      // IF NOT VIP GUILD, NUKE
      if (!botCache.vipGuildIDs.has(message.guildID)) {
        return cache.messages.delete(message.id);
      }

      // Delete any messages over 10 minutes old
      if (now - message.timestamp > botCache.constants.milliseconds.MINUTE * 10) {
        cache.messages.delete(message.id);
      }
    });
  },
});

async function clearMember(member: Member, vipIDs: string[], now: number) {
  if (member.id === botID) return;
  // Delete any member who has not been active in the last 30 minutes and is not currently in a voice channel
  const lastActive = botCache.memberLastActive.get(member.id);
  // If the user is active recently
  if (lastActive && now - lastActive < botCache.constants.milliseconds.MINUTE * 30) {
    return;
  }

  // Has a vip guild
  if (vipIDs.some((id) => member.guilds.has(id))) {
    return;
  }

  cache.members.delete(member.id);
  botCache.memberLastActive.delete(member.id);
}
