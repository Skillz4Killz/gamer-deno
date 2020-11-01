import { botCache } from "../../cache.ts";

botCache.constants.counting = {
  shop: [
    { id: 1, type: "buff", name: "commands/counting:DOUBLE_TIME", cost: 1000 },
    { id: 2, type: "buff", name: "commands/counting:IMMUNITY", cost: 1000 },
    { id: 4, type: "buff", name: "commands/counting:CLEANUP", cost: 1000 },
    {
      id: 5,
      type: "buff",
      name: "commands/counting:SOLO_LEVELING",
      cost: 1000,
    },
    { id: 6, type: "debuff", name: "commands/counting:STEAL", cost: 1000 },
    { id: 7, type: "debuff", name: "commands/counting:SLOWMODE", cost: 1000 },
    { id: 8, type: "debuff", name: "commands/counting:HIRE_THIEF", cost: 1000 },
    {
      id: 9,
      type: "debuff",
      name: "commands/counting:QUICK_THINKING",
      cost: 1000,
    },
  ],
};
