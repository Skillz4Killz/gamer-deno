import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";
import type { sendResponse, createSubcommand } from "../../utils/helpers.ts";
import type { guildsDatabase } from "../../database/schemas/guilds.ts";
import type { sendMessage } from "../../../deps.ts";

// This command will only execute if there was no valid sub command: !language
botCache.commands.set("language", {
  name: "language",
  arguments: [
    {
      name: "subcommmand",
      type: "subcommand",
      literals: ["set"],
    },
  ],
  guildOnly: true,
  permissionLevels: [PermissionLevels.MEMBER],
  execute: (message, args) => {
    const language = botCache.guildLanguages.get(message.guildID) || "en_US";
    sendResponse(
      message,
      botCache.constants.personalities.find((personality) =>
        personality.id === language
      )?.name ||
        ":flag_us: English (Default Language)",
    );

    sendMessage(
      message.channel,
      botCache.constants.personalities.map((personality, index) =>
        `${index + 1}. ${personality.name}`
      ).join("\n"),
    );
  },
});

// Create a subcommand for when users do !language set $
createSubcommand("language", {
  name: "set",
  permissionLevels: [
    PermissionLevels.BOT_OWNER,
    PermissionLevels.BOT_SUPPORT,
    PermissionLevels.BOT_DEVS,
  ],
  arguments: [
    {
      name: "language",
      type: "string",
      literals: botCache.constants.personalities.reduce(
        (array, p) => [...array, ...p.names],
        [] as string[],
      ),
    },
  ],
  execute: async (message, args: LanguageArgs) => {
    const language = botCache.constants.personalities.find((p) =>
      p.names.includes(args.language)
    );
    const oldlanguage = botCache.guildLanguages.get(message.guildID) || "en_US";
    const oldName = botCache.constants.personalities.find((p) =>
      p.id === oldlanguage
    );
    const languageID = language?.id || "en_US";

    const settings = await guildsDatabase.find({ guildID: message.guildID });
    if (!settings) {
      guildsDatabase.insertOne(
        {
          guildID: message.guildID,
          language: languageID || "en_US",
          prefix: ".",
        },
      );
    } else if (
      (botCache.guildLanguages.get(message.guildID) || "en_US") !== languageID
    ) {
      guildsDatabase.updateOne(
        { guildID: message.guildID },
        { language: languageID || "en_US" },
      );
    }

    botCache.guildLanguages.set(message.guildID, languageID || "en_US");
    sendResponse(message, `${oldName?.name} => **${language?.name}**`);
  },
});

interface LanguageArgs {
  language: string;
}
