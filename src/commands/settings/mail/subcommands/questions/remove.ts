import { botCache } from "../../../../../../cache.ts";
import { db } from "../../../../../database/database.ts";
import { PermissionLevels } from "../../../../../types/commands.ts";
import { createSubcommand } from "../../../../../utils/helpers.ts";

createSubcommand("settings-mails-questions", {
  name: "remove",
  aliases: ["r"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "label", type: "...string", lowercase: true },
  ],
  execute: async function (message, args: SettingsMailsQuestionsRemoveArgs) {
    const settings = await db.guilds.get(message.guildID);
    if (!settings) return botCache.helpers.reactError(message);

    if (
      !settings.mailQuestions.some((q) => q.name.toLowerCase() !== args.label)
    ) {
      return botCache.helpers.reactError(message);
    }

    db.guilds.update(message.guildID, {
      mailQuestions: settings.mailQuestions.filter((q) =>
        q.name.toLowerCase() !== args.label
      ),
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface SettingsMailsQuestionsRemoveArgs {
  label: string;
}
