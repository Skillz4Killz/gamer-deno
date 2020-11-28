import { botCache } from "../../cache.ts";
import { chooseRandom } from "../../deps.ts";
import { editBotProfile } from "../../deps.ts"

 botCache.tasks.set(`botlogo`, {
  name: `botlogo`,
   interval: botCache.constants.milliseconds.WEEK,
    execute: async function () {
    editBotProfile(chooseRandom(botCache.constants.botlogos))
    },
});
