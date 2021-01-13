import { botCache, cache, fetchMembers } from "../../deps.ts";

botCache.tasks.set("vipmembers", {
  name: "vipmembers",
  interval: botCache.constants.milliseconds.HOUR,
  execute: async function () {
    botCache.vipGuildIDs.forEach(async (id) => {
      const guild = cache.guilds.get(id);
      if (!guild) return;

      const cachedMembers = cache.members.filter((m) => m.guilds.has(id));
      // ALL MEMBERS ARE ALREADY CACHED
      if (guild.memberCount === cachedMembers.size) return;

      // FETCH MEMBERS TO MAKE SURE WE NOT MISSING ANY
      await fetchMembers(guild).catch(console.log);
    });
  },
});
