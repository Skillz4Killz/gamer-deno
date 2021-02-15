import { createSubcommand } from "../../../utils/helpers.ts";
import { botCache } from "../../../../deps.ts";
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
  ] as const,
  vipServerOnly: true,
  execute: async function (message, args) {
    if (typeof args.emoji === "string") {
      return botCache.helpers.reactError(message);
    }

    const emojiID = args.emoji.id;

    const emojiExists = db.emojis.findOne((value) => value.emojiID === emojiID || value.name === args.name);
    if (!emojiID || emojiExists) {
      return botCache.helpers.reactError(message);
    }

    await db.emojis.create(emojiID, {
      id: emojiID,
      userID: message.author.id,
      emojiID: emojiID,
      fullCode: `<${args.emoji.animated ? `a` : ``}:${args.emoji.name}:${emojiID}>`,
      guildID: message.guildID,
      name: args.name,
    });

    return botCache.helpers.reactSuccess(message);
  },
});
