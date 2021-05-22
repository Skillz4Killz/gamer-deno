import { botCache, cache, fetchMembers, snowflakeToBigint } from "../../deps.ts";

botCache.tasks.set("vipmembers", {
  name: "vipmembers",
  interval: botCache.constants.milliseconds.HOUR,
  execute: function () {
    botCache.vipGuildIDs.forEach(async (id) => {
      const guild = cache.guilds.get(snowflakeToBigint(id));
      if (!guild) return;

      const cachedMembers = cache.members.filter((m) => m.guilds.has(snowflakeToBigint(id)));
      // ALL MEMBERS ARE ALREADY CACHED
      if (guild.memberCount === cachedMembers.size) return;

      // FETCH MEMBERS TO MAKE SURE WE NOT MISSING ANY
      await fetchMembers(guild.id, guild.shardId).catch(console.log);
    });
  },
});
