import { db } from "../../../database/database.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "surveys",
  aliases: ["survey"],
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message) {
    const surveys = await db.surveys.findMany({ guildID: message.guildID }, true);
    return message.reply(surveys.map((survey) => survey.name).join("\n"));
  },
});
