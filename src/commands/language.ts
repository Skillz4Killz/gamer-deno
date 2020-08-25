import { botCache } from "../../mod.ts";
import { PermissionLevels } from "../types/commands.ts";
import { sendResponse, sendEmbed, createSubcommand } from "../utils/helpers.ts";
import { Embed } from "../utils/Embed.ts";
import Guild from "../database/schemas/guilds.ts";

// This command will only execute if there was no valid sub command: !language
botCache.commands.set("language", {
  name: "language",
  arguments: [
    {
      name: "sub commmand",
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
  },
});

// Create a subcommand for when users do !language set $
createSubcommand("language", {
  name: "set",
  arguments: [
    {
      name: "language",
      type: "string",
      literals: botCache.constants.personalities.reduce(
        (array, personality) => [...array, ...personality.names],
        [] as string[],
      ),
      required: true,
      lowercase: true,
      missing: (message) => {
        sendResponse(message, `please provide a language`);
      },
    },
  ],
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async (message, args: LanguageArgs) => {
    const language = botCache.constants.personalities.find((p) => p.names.includes(args.language));
    const oldlanguage = botCache.guildLanguages.get(message.guildID);
    const oldName = botCache.constants.personalities.find((p) => p.id === oldlanguage);
    botCache.guildLanguages.set(message.guildID, language?.id || "en_US");

    const settings = await Guild.find(message.guildID);
    if (!settings) {
      Guild.create({ id: message.guildID, language: language?.id || "en_US" });
    } else {
      Guild.where("id", message.guildID).update(
        "language",
        language?.id || "en_US",
      );
    }

    const embed = new Embed()
      .setTitle("Success, language was changed")
      .setDescription(`
        **Old language**: \`${oldName}\`
        **New language**: \`${language?.name}\`
      `)
      .setTimestamp();

    sendEmbed(message.channel, embed);
  },
});

interface LanguageArgs {
  language: string;
}
