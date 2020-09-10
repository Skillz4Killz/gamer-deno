import { botCache } from "../../../../mod.ts";
import { surveysDatabase } from "../../../database/schemas/surveys.ts";
import { sendResponse } from "../../../utils/helpers.ts";

botCache.commands.set("survey", {
  name: "surveys",
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message, args, guild) {
    const surveys = await surveysDatabase.find({ guildID: message.guildID });
    sendResponse(message, surveys.map((survey) => survey.name).join("\n"));
  },
});
