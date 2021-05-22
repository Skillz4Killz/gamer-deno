import { botCache, cache, snowflakeToBigint } from "../../deps.ts";
import { activeIdleGuildIDs } from "../commands/gaming/idle/upgrade.ts";
import { db } from "../database/database.ts";

// The task will runonce an hour but we want to monitor activity once a day
let idleguildscounter = 0;

botCache.tasks.set(`idleguilds`, {
  name: `idleguilds`,
  interval: botCache.constants.milliseconds.MINUTE * 60,
  execute: async function () {
    idleguildscounter++;

    const profiles = await db.idle.getAll();

    for (const profile of profiles.values()) {
      console.log(`[Task - IdleGuilds] Processing profile ${profile.id}`);

      const newIDs: string[] = [];

      for (const id of profile.guildIDs) {
        // This is no longer a valid guild
        if (!cache.guilds.has(snowflakeToBigint(id)) && !botCache.dispatchedGuildIDs.has(id)) continue;
        if (idleguildscounter >= 24 && !activeIdleGuildIDs.has(id)) continue;

        newIDs.push(id);
      }

      if (newIDs.length === profile.guildIDs.length) return;

      db.idle.update(profile.id, { guildIDs: newIDs });
    }

    // RESET COUNTER
    if (idleguildscounter >= 24) idleguildscounter = 0;
  },
});
