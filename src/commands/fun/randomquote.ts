import { botCache } from "../../../deps.ts";
import { createCommand } from "../../utils/helpers.ts";
import { translate, translateArray } from "../../utils/i18next.ts";

const quoteData = [
  { name: "advice", aliases: ["ad"], requireArgs: false },
  { name: "8ball", aliases: [`8b`, `fortune`], requireArgs: true },
];

quoteData.forEach(async (data) => {
  createCommand({
    name: data.name,
    aliases: data.aliases,
    guildOnly: true,
    execute: async function (message) {
      return message.reply("/random");
      //   if (data.requireArgs) {
      //     if (message.content.split(" ").length < 2) {
      //       return message.reply(translate(message.guildID, `strings:${data.name.toUpperCase()}_NEED_ARGS`));
      //     }
      //   }

      //   const quotes = translateArray(message.guildID, `strings:${data.name.toUpperCase()}_QUOTES`);
      //   const random = botCache.helpers.chooseRandom(quotes);
      //   return message.reply(random);
    },
  });
});
