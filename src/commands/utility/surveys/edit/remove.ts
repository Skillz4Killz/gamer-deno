import { createSubcommand } from "../../../../utils/helpers.ts";
import { botCache } from "../../../../../mod.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

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
    const survey = await db.surveys.findOne(
      { guildID: message.guildID, name: args.name },
    );
    if (!survey) return botCache.helpers.reactError(message);

    // Survey found, edit now
    db.surveys.updateOne({
      guildID: message.guildID,
      name: args.name,
    }, {
      questions: survey.questions.filter((value, index) =>
        index + 1 !== args.index
      ),
    });

    botCache.helpers.reactSuccess(message);
  },
});

interface SurveysEditQuestionsRemoveArgs {
  name: string;
  index: number;
}
