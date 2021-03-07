import { botCache, cache } from "../../deps.ts";
import { db } from "../database/database.ts";

botCache.tasks.set(`idleguilds`, {
  name: `idleguilds`,
  interval: botCache.constants.milliseconds.MINUTE * 60,
  execute: async function () {
    const profiles = await db.idle.getAll();

    profiles.forEach((profile) => {
      const newIDs: string[] = [];

      for (const id of profile.guildIDs) {
        // This is no longer a valid guild
        if (!cache.guilds.has(id) && !botCache.dispatchedGuildIDs.has(id)) continue;

        newIDs.push(id);
      }

      if (newIDs.length === profile.guildIDs.length) return;

      db.idle.update(profile.id, { guildIDs: newIDs });
    });
  },
});
