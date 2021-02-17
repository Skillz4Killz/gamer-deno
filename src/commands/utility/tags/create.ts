import { botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("tag", {
  name: "create",
  aliases: ["c"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "type", type: "string", literals: ["basic", "advanced", "random"] },
    { name: "text", type: "...string" },
  ] as const,
  execute: async function (message, args, guild) {
    const tagExists = await db.tags.get(`${message.guildID}-${args.name}`);
    if (tagExists) return botCache.helpers.reactError(message);

    // Random tags are vip only feature
    if (args.type === "random" && !botCache.vipGuildIDs.has(message.guildID)) {
      return botCache.helpers.reactError(message, true);
    }

    const member = cache.members.get(message.author.id);
    if (!member) return botCache.helpers.reactError(message);

    try {
      const transformed = await botCache.helpers.variables(args.text, member, guild, member);
      const embedCode = JSON.parse(transformed);
      const embed = new Embed(embedCode);
      // Send the tag so the user can see what it looks like.
      // The await will make sure its valid before we add it to the db
      await message.send({ embed, content: embedCode.plaintext });

      await db.tags.update(`${message.guildID}-${args.name}`, {
        randomOptions: args.type === "random" ? args.text.split(" ") : [],
        embedCode: args.text,
        guildID: message.guildID,
        mailOnly: false,
        name: args.name,
        type: args.type,
      });

      botCache.tagNames.add(`${message.guildID}-${args.name}`);
      return botCache.helpers.reactSuccess(message);
    } catch (error) {
      return message.send(["```js", error, "```"].join("\n"));
    }
  },
});
