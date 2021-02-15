import { botCache } from "../../../../deps.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("emojis", {
  name: "info",
  aliases: ["i"],
  arguments: [
    {
      name: "name",
      type: "string",
      lowercase: true,
    },
  ] as const,
  execute: async function (message, args, guild) {
    const validEmoji = guild?.emojis.find((emoji) => emoji.name.toLowerCase() === args.name);
    // if it's not a valid emoji add a reaction through the reactError function
    if (!validEmoji) return botCache.helpers.reactError(message);

    // create an embed with all the information we can cram into it about an emoji. Right click and go to type definition to see:  Name, ID, animated
    const embed = new Embed()
      .addField(translate(message.guildID, "common:NAME"), validEmoji.name)
      .addField(translate(message.guildID, "common:ID"), validEmoji.id!, true)
      .addField(
        translate(message.guildID, "common:ANIMATED"),
        validEmoji.animated ? botCache.constants.emojis.success : botCache.constants.emojis.failure,
        true
      );

    // if this emoji has an id, we can use it as a thumbnail
    if (validEmoji.id) {
      embed.setThumbnail(`https://cdn.discordapp.com/emojis/${validEmoji.id}.png`);
    }

    return message.send({ embed });
  },
});
