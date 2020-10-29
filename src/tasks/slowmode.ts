import { botCache } from "../../cache.ts";

botCache.tasks.set(`slowmode`, {
  name: `slowmode`,
  interval: botCache.constants.milliseconds.MINUTE * 2,
  execute: async function () {
    const now = Date.now();
    botCache.slowmode.forEach((timestamp, key) => {
      if (now > timestamp) return;
      botCache.slowmode.delete(key);
    });
  },
});
