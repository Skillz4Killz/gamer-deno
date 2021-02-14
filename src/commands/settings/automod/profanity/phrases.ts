import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod-profanity", {
  name: "phrases",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "words", type: "...string", lowercase: true },
  ] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);
    const profanityWords = new Set(settings?.profanityPhrases);

    if (args.type === "add") {
      profanityWords.add(args.words);
    } else {
      profanityWords.delete(args.words);
    }

    await db.guilds.update(message.guildID, {
      profanityPhrases: [...profanityWords.values()],
    });
    return botCache.helpers.reactSuccess(message);
  },
});
