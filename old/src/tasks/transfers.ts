import { botCache } from "../../deps.ts";

botCache.tasks.set("transfers", {
  name: "transfers",
  interval: botCache.constants.milliseconds.DAY,
  execute: async function () {
    botCache.transferLog.clear();
  },
});
