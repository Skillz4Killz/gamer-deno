import { botCache } from "../../deps.ts";

botCache.tasks.set(`botlogo`, {
  name: `botlogo`,
  interval: botCache.constants.milliseconds.WEEK,
  execute: function () {
    edit(undefined, chooseRandom(botCache.constants.botLogos));
  },
});
