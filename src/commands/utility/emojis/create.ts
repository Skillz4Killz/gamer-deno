import { Emoji } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { botCache } from "../../../../mod.ts";
import { db } from "../../../database/database.ts";

createSubcommand("emojis", {
  name: "create",
  aliases: ["c"],
  arguments: [
    {
      name: "name",
      type: "string",
      lowercase: true,
    },
    {
      name: "emoji",
      type: "emoji",
    },
  ],
  guildOnly: true,
  execute: async function (message, args: EmojiCreateArgs) {
    const emojiExists = db.emojis.findOne((value) =>
      value.emojiID === args.emoji.id || value.name === args.name
    );
    if (!args.emoji.id || emojiExists) {
      return botCache.helpers.reactError(message);
    }

    db.emojis.create(args.emoji.id, {
      userID: message.author.id,
      emojiID: args.emoji.id,
      fullCode: `<${
        args.emoji.animated ? `a` : ``
      }:${args.emoji.name}:${args.emoji.id}>`,
      guildID: message.guildID,
      name: args.name,
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface EmojiCreateArgs {
  name: string;
  emoji: Emoji;
}
