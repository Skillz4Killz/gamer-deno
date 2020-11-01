import { botCache } from "../../cache.ts";

botCache.tasks.set(`supportactivity`, {
  name: `supportactivity`,
  interval: botCache.constants.milliseconds.DAY,
  execute: async function () {
    botCache.activeMembersOnSupportServer.clear();
  },
});
