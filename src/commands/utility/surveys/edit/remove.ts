import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

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
  ] as const,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message, args) {
    const survey = await db.surveys.get(`${message.guildID}-${args.name}`);
    if (!survey) return botCache.helpers.reactError(message);

    // Survey found, edit now
    await db.surveys.update(`${message.guildID}-${args.name}`, {
      questions: survey.questions.filter((value, index) => index + 1 !== args.index),
    });

    return botCache.helpers.reactSuccess(message);
  },
});
