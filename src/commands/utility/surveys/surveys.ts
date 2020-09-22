import { surveysDatabase } from "../../../database/schemas/surveys.ts";
import { createCommand, sendResponse } from "../../../utils/helpers.ts";

createCommand({
  name: "surveys",
  aliases: ["survey"],
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
