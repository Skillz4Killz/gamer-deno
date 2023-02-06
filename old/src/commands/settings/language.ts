import { botCache, sendMessage } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand, sendResponse } from "../../utils/helpers.ts";

// This command will only execute if there was no valid sub command: !language
createSubcommand("settings", {
  name: "language",
  arguments: [
    {
      name: "language",
      type: "string",
      literals: botCache.constants.personalities.reduce((array, p) => [...array, ...p.names], [] as string[]),
      required: false,
    },
  ] as const,
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
  execute: async function (message, args) {
    if (!args.language) {
      const language = botCache.guildLanguages.get(message.guildID) || "en_US";
      await sendResponse(
        message,
        botCache.constants.personalities.find((personality) => personality.id === language)?.name ||
          "🇺🇸 English (Default Language)"
      );

      return sendMessage(
        message.channelID,
        botCache.constants.personalities.map((personality, index) => `${index + 1}. ${personality.name}`).join("\n")
      );
    }

    // Set a language
    const language = botCache.constants.personalities.find((p) => p.names.includes(args.language!));
    const oldlanguage = botCache.guildLanguages.get(message.guildID) || "en_US";
    const oldName = botCache.constants.personalities.find((p) => p.id === oldlanguage);
    const languageID = language?.id || "en_US";

    await db.guilds.update(message.guildID, {
      language: languageID || "en_US",
    });

    botCache.guildLanguages.set(message.guildID, languageID || "en_US");
    return message.reply(`${oldName?.name} => **${language?.name}**`);
  },
});
