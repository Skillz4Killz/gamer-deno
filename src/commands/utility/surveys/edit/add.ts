import { createSubcommand, sendResponse } from "../../../../utils/helpers.ts";
import { botCache } from "../../../../../mod.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { deleteMessages } from "../../../../../deps.ts";
import { translate } from "../../../../utils/i18next.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("surveys-edit-questions", {
  name: "add",
  arguments: [
    {
      name: "name",
      type: "string",
      lowercase: true,
    },
    {
      name: "type",
      type: "string",
      literals: [
        `string`,
        `...string`,
        `number`,
        `member`,
        `members`,
        `snowflake`,
        `...snowflakes`,
        `multiple-choice`,
      ],
    },
    { name: "question", type: "...string" },
  ],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message, args: SurveysEditQuestionsAddArgs) {
    const survey = await db.surveys.findOne(
      { guildID: message.guildID, name: args.name },
    );
    if (!survey) return botCache.helpers.reactError(message);

    const options: string[] = [];

    // Depending on type of answer type of options
    if (args.type === `multiple-choice`) {
      const optionsQuestion = await sendResponse(
        message,
        translate(message.guildID, "commands/surveys:NEED_OPTIONS"),
      );
      const optionsResponse = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID,
      );
      if (!optionsResponse) return botCache.helpers.reactError(message);

      deleteMessages(
        message.channelID,
        [optionsResponse.id, optionsQuestion.id],
      )
        .catch(() => undefined);
      options.push(...optionsResponse.content.split(` | `));
    }

    // Survey found, edit now
    db.surveys.updateOne({
      guildID: message.guildID,
      name: args.name,
    }, {
      questions: [...survey.questions, {
        question: args.question,
        type: args.type,
        options,
      }],
    });

    botCache.helpers.reactSuccess(message);
  },
});

interface SurveysEditQuestionsAddArgs {
  name: string;
  type:
    | `string`
    | `...string`
    | `number`
    | `member`
    | `members`
    | `snowflake`
    | `...snowflakes`
    | `multiple-choice`;
  question: string;
}
