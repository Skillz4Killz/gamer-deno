import { botCache, chooseRandom } from "../../deps.ts";
import { db } from "../database/database.ts";

// Randomly select 3 new missions every 30 minutes
botCache.tasks.set("missions", {
  name: "missions",
  interval: botCache.constants.milliseconds.MINUTE * 30,
  execute: async function () {
    // Remove all missions first before creating any new missions
    await db.mission.deleteMany({});

    botCache.missionStartedAt = Date.now();

    // Find new random missions to use
    botCache.missions = [];

    while (botCache.missions.length < 5) {
      const randomMission = chooseRandom(botCache.constants.missions);
      if (!botCache.missions.find((m) => m.title === randomMission.title)) {
        botCache.missions.push(randomMission);
      }
    }
  },
});
