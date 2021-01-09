import { botCache } from "../../../../../../deps.ts";
import { db } from "../../../../../database/database.ts";
import { PermissionLevels } from "../../../../../types/commands.ts";
import { createSubcommand } from "../../../../../utils/helpers.ts";

createSubcommand("settings-feedback-bugs-questions", {
  name: "remove",
  aliases: ["r"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "label", type: "...string", lowercase: true },
  ] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);
    if (!settings) return botCache.helpers.reactError(message);

    if (
      !settings.bugsQuestions.some((q) => q.name.toLowerCase() !== args.label)
    ) {
      return botCache.helpers.reactError(message);
    }

    await db.guilds.update(message.guildID, {
      bugsQuestions: settings.bugsQuestions.filter((q) =>
        q.name.toLowerCase() !== args.label
      ),
    });

    return botCache.helpers.reactSuccess(message);
  },
});
