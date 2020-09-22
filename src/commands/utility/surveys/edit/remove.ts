import type { createSubcommand } from "../../../../utils/helpers.ts";
import { botCache } from "../../../../../mod.ts";
import type { PermissionLevels } from "../../../../types/commands.ts";
import type { surveysDatabase } from "../../../../database/schemas/surveys.ts";

createSubcommand("surveys-edit-questions", {
  name: "remove",
  arguments: [
    {
      name: "name",
      type: "string",
      lowercase: true,
    },
    {
      name: "index",
      type: "number",
    },
  ],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message, args: SurveysEditQuestionsRemoveArgs) {
    const survey = await surveysDatabase.findOne(
      { guildID: message.guildID, name: args.name },
    );
    if (!survey) return botCache.helpers.reactError(message);

    // Survey found, edit now
    surveysDatabase.updateOne({
      guildID: message.guildID,
      name: args.name,
    }, {
      $set: {
        questions: survey.questions.filter((value, index) =>
          index + 1 !== args.index
        ),
      },
    });

    botCache.helpers.reactSuccess(message);
  },
});

interface SurveysEditQuestionsRemoveArgs {
  name: string;
  index: number;
}
