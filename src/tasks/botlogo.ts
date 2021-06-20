import {
  botCache,
  // chooseRandom,
  // editBotProfile
} from "../../deps.ts";

botCache.tasks.set(`botlogo`, {
  name: `botlogo`,
  interval: botCache.constants.milliseconds.WEEK,
  execute: async function () {
    // editBotProfile(undefined, chooseRandom(botCache.constants.botLogos));
  },
});
