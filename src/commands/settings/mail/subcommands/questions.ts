import { sendMessage } from "../../../../../deps.ts";
import { botCache } from "../../../../../cache.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-mails", {
  name: "questions",
  aliases: ["q"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
  ],
  execute: async function (message) {
    // .settings mails questions should show the current list
    const settings = await db.guilds.get(message.guildID);
    if (!settings) return botCache.helpers.reactError(message);

    let counter = 1;
    for (const question of settings.mailQuestions) {
      const response = [
        `${counter}. **${question.name}**`,
        `Type: ${question.type} ${
          question.subtype ? `=> ${question.subtype}` : ""
        }`,
        `Options: ${question.options?.join("\n")}`,
      ];
      if (question.subtype) {
        response.push(`Type: ${question.type} => ${question.subtype}`);
      } else response.push(`Type: ${question.type}`);

      if (question.options?.length) response.push(question.options.join("\n"));

      sendMessage(message.channelID, response.join("\n"));

      counter++;
    }
  },
});
