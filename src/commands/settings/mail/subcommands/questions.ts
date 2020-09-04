import { botCache } from "../../../../../mod.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand, sendResponse } from "../../../../utils/helpers.ts";
import { guildsDatabase } from "../../../../database/schemas/guilds.ts";
import { sendMessage } from "https://x.nest.land/Discordeno@8.4.2/src/handlers/channel.ts";

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
    const settings = await guildsDatabase.findOne({ guildID: message.guildID });
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

      sendMessage(message.channel, response.join("\n"));
    }
  },
});
