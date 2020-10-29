import { createSubcommand } from "../../../utils/helpers.ts";
import { botCache } from "../../../../cache.ts";
import { db } from "../../../database/database.ts";

createSubcommand("emojis", {
  name: "delete",
  aliases: ["d"],
  arguments: [
    {
      name: "name",
      type: "string",
      lowercase: true,
    },
  ],
  guildOnly: true,
  execute: async function (message, args: EmojiDeleteArgs) {
    db.emojis.deleteOne((emoji) =>
      emoji.userID === message.author.id && emoji.name === args.name
    );
    return botCache.helpers.reactSuccess(message);
  },
});

interface EmojiDeleteArgs {
  name: string;
}
