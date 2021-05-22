import { botCache, editBotProfile } from "../../deps.ts";
import { chooseRandom } from "../utils/helpers.ts";

botCache.tasks.set(`botlogo`, {
  name: `botlogo`,
  interval: botCache.constants.milliseconds.WEEK,
  execute: function () {
    editBotProfile(undefined, chooseRandom(botCache.constants.botLogos));
  },
});
