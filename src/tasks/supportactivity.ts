import { botCache } from "../../mod.ts";

botCache.tasks.set(`supportactivity`, {
  name: `supportactivity`,
  interval: botCache.constants.milliseconds.DAY,
  execute: async function () {
    botCache.activeMembersOnSupportServer.clear();
  },
});
