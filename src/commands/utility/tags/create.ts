import { botCache, cache, sendMessage } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";

createSubcommand("tags", {
  name: "create",
  aliases: ["c"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "type", type: "string", literals: ["basic", "advanced", "random"] },
    { name: "text", type: "...string" },
  ],
  execute: async function (message, args: TagCreateArgs, guild) {
    const tagExists = await db.tags.findOne(
      { guildID: message.guildID, name: args.name },
    );
    if (tagExists) return botCache.helpers.reactError(message);

    // Random tags are vip only feature
    if (
      args.type === "random" && !botCache.vipGuildIDs.has(message.guildID)
    ) {
      return botCache.helpers.reactError(message, true);
    }

    const member = cache.members.get(message.author.id);
    if (!member) return botCache.helpers.reactError(message);

    try {
      const transformed = await botCache.helpers.variables(
        args.text,
        member,
        guild,
        member,
      );
      const embedCode = JSON.parse(transformed);
      const embed = new Embed(embedCode);
      // Send the tag so the user can see what it looks like.
      // The await will make sure its valid before we add it to the db
      await sendEmbed(message.channelID, embed, embedCode.plaintext);

      db.tags.update(`${message.guildID}-${args.name}`, {
        randomOptions: args.type === "random" ? [args.text] : [],
        embedCode: args.text,
        guildID: message.guildID,
        mailOnly: false,
        name: args.name,
        type: args.type,
      });

      botCache.tagNames.add(`${message.guildID}-${args.name}`);
      return botCache.helpers.reactSuccess(message);
    } catch (error) {
      return sendMessage(message.channelID, ["```js", error, "```"].join("\n"));
    }
  },
});

interface TagCreateArgs {
  name: string;
  type: "basic" | "advanced" | "random";
  text: string;
}
