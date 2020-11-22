import { botCache } from "../../cache.ts";

botCache.constants.counting = {
  shop: [
    { id: 1, type: "buff", name: "strings:COUNTING_DOUBLE_TIME", cost: 1000 },
    { id: 2, type: "buff", name: "strings:COUNTING_IMMUNITY", cost: 1000 },
    { id: 4, type: "buff", name: "strings:COUNTING_CLEANUP", cost: 1000 },
    {
      id: 5,
      type: "buff",
      name: "strings:COUNTING_SOLO_LEVELING",
      cost: 1000,
    },
    { id: 6, type: "debuff", name: "strings:COUNTING_STEAL", cost: 1000 },
    { id: 7, type: "debuff", name: "strings:COUNTING_SLOWMODE", cost: 1000 },
    { id: 8, type: "debuff", name: "strings:COUNTING_HIRE_THIEF", cost: 1000 },
    {
      id: 9,
      type: "debuff",
      name: "strings:COUNTING_QUICK_THINKING",
      cost: 1000,
    },
  ],
};
