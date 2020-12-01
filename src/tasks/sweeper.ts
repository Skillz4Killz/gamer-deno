import { botCache, cache, cacheHandlers } from "../../deps.ts";

botCache.tasks.set(`sweeper`, {
  name: `sweeper`,
  interval: botCache.constants.milliseconds.MINUTE * 5,
  execute: async function () {
    const now = Date.now();
    // Delete presences from the bots cache.
    cacheHandlers.clear("presences");

    for (const member of cache.members.values()) {
      // Delete any member who has not been active in the last 30 minutes and is not currently in a voice channel
      const lastActive = botCache.memberLastActive.get(member.id);
      // If the user is active recently
      if (
        lastActive &&
        now - lastActive < botCache.constants.milliseconds.MINUTE * 30
      ) {
        return;
      }

      // Has a vip guild
      if (
        [...botCache.vipGuildIDs.values()].some((id) => member.guilds.has(id))
      ) {
        return;
      }

      cache.members.delete(member.id);
      botCache.memberLastActive.delete(member.id);
    }

    // For every guild, we will clean the cache
    cacheHandlers.forEach("guilds", (guild) => {
      // Delete presences from the guild caches.
      guild.presences.clear();
    });

    // For ever, message we will delete if necessary
    cacheHandlers.forEach("messages", (message) => {
      // Delete any messages over 10 minutes old
      if (
        now - message.timestamp > botCache.constants.milliseconds.MINUTE * 10
      ) {
        cache.messages.delete(message.id);
      }
    });
  },
});
