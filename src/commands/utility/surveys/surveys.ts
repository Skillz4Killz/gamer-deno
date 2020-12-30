import { db } from "../../../database/database.ts";
import { createCommand, sendResponse } from "../../../utils/helpers.ts";

createCommand({
  name: "surveys",
  aliases: ["survey"],
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message) {
    const surveys = await db.surveys.findMany(
      { guildID: message.guildID },
      true,
    );
    await sendResponse(
      message,
      surveys.map((survey) => survey.name).join("\n"),
    );
  },
});
