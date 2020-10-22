import { botCache } from "../../../../../../mod.ts";
import { db } from "../../../../../database/database.ts";
import { PermissionLevels } from "../../../../../types/commands.ts";
import { createSubcommand } from "../../../../../utils/helpers.ts";

createSubcommand("settings-feedback-idea-questions", {
  name: "remove",
  aliases: ["r"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "label", type: "...string", lowercase: true },
  ],
  execute: async function (message, args: SettingsIdeaQuestionsRemoveArgs) {
    const settings = await db.guilds.get(message.guildID);
    if (!settings) return botCache.helpers.reactError(message);

    if (
      !settings.ideaQuestions.some((q) => q.name.toLowerCase() !== args.label)
    ) {
      return botCache.helpers.reactError(message);
    }

    db.guilds.update(message.guildID, {
      ideaQuestions: settings.ideaQuestions.filter((q) =>
        q.name.toLowerCase() !== args.label
      ),
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface SettingsIdeaQuestionsRemoveArgs {
  label: string;
}
