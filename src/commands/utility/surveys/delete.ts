import { createSubcommand } from "../../../utils/helpers.ts";
import { surveysDatabase } from "../../../database/schemas/surveys.ts";
import { botCache } from "../../../../mod.ts";

createSubcommand("surveys", {
  name: "delete",
  aliases: ["d"],
  arguments: [
    { name: "name", type: "string", lowercase: true },
  ],
  cooldown: {
    seconds: 30,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  execute: function (message, args: SurveysDeleteName) {
    surveysDatabase.deleteOne({
      guildID: message.guildID,
      name: args.name,
    });

    botCache.helpers.reactSuccess(message);
  },
});

interface SurveysDeleteName {
  name: string;
}
