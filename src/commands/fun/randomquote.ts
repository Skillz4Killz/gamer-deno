import { botCache } from "../../../deps.ts";
import { translate, translateArray } from "../../utils/i18next.ts";
import { createCommand, sendResponse } from "../../utils/helpers.ts";

const quoteData = [
  { name: "advice", aliases: ["ad"], requireArgs: false },
  { name: "8ball", aliases: [`8b`, `fortune`], requireArgs: true },
];

quoteData.forEach(async (data) => {
  createCommand({
    name: data.name,
    aliases: data.aliases,
    guildOnly: true,
    execute: async function (message, _args, guild) {
      if (data.requireArgs) {
        if (message.content.split(" ").length < 2) {
          return sendResponse(
            message,
            translate(
              message.guildID,
              `strings:${data.name.toUpperCase()}_NEED_ARGS`,
            ),
          );
        }
      }

      const quotes = translateArray(
        message.guildID,
        `strings:${data.name.toUpperCase()}_QUOTES`,
      );
      const random = botCache.helpers.chooseRandom(quotes);
      await sendResponse(message, random);
    },
  });
});
