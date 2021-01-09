import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod-profanity", {
  name: "soft",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "words", type: "...string", lowercase: true },
  ] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);
    const profanityWords = new Set(settings?.profanityWords);

    for (const word of args.words.split(" ")) {
      if (args.type === "add") {
        profanityWords.add(word);
      } else {
        profanityWords.delete(word);
      }
    }

    await db.guilds.update(
      message.guildID,
      { profanityWords: [...profanityWords.values()] },
    );
    await botCache.helpers.reactSuccess(message);
  },
});
