import { botCache, cache } from "../../deps.ts";
import { db } from "../database/database.ts";

botCache.tasks.set("xpdecay", {
  name: "xpdecay",
  interval: botCache.constants.milliseconds.DAY,
  execute: function () {
    botCache.vipGuildIDs.forEach(async (guildID) => {
      const settings = await db.guilds.get(guildID);
      if (!settings?.xpDecayDays) return;

      for (const member of cache.members.values()) {
        if (member.guilds.has(guildID)) continue;

        // This user spoke today so not worth fetching his data
        if (botCache.analyticsDetails.has(`${member.id}-${guildID}`)) continue;

        const userSettings = await db.users.get(member.id);
        if (!userSettings) return;

        const guildXP = userSettings.localXPs.find((x) =>
          x.guildID === guildID
        );
        if (!guildXP) return;

        // If below 100XP do not decay
        if (guildXP.xp < 100) return;

        // Calculate how many days it has been since this user was last updated
        const daysSinceLastUpdated = (Date.now() - guildXP.lastUpdatedAt) /
          botCache.constants.milliseconds.DAY;
        if (daysSinceLastUpdated < settings.xpDecayDays) return;

        // Remove 1% of XP from the user for being inactive today.
        botCache.helpers.removeXP(
          guildID,
          member.id,
          Math.floor(((settings.decayPercentange || 1) / 1000) * guildXP.xp),
        );
      }
    });
  },
});
