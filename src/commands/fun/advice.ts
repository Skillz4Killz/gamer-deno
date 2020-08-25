import { botCache } from "../../../mod.ts";
import { translateArray } from "../../utils/i18next.ts";
import { sendResponse, createCommandAliases } from "../../utils/helpers.ts";

botCache.commands.set(`advice`, {
  name: `advice`,
  guildOnly: true,
  execute: (message, _args, guild) => {
    const advices = translateArray(message.guildID, "commands/advice:QUOTES");
    const advice = botCache.helpers.chooseRandom(advices);
    sendResponse(message, advice);

    // TODO: Mission
  },
});

createCommandAliases("advice", "ad");
