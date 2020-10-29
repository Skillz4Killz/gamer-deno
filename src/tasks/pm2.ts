import { botCache } from "../../cache.ts";

botCache.tasks.set(`pm2`, {
  name: `pm2`,
  interval: botCache.constants.milliseconds.MINUTE * 30,
  execute: async function () {
    Deno.run({ cmd: ["pm2", "flush"] });
  },
});
