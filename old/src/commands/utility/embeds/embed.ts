import { botCache, cache } from "../../../../deps.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createCommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createCommand({
  name: "embed",
  guildOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "text", type: "...string" },
  ] as const,
  execute: async function (message, args, guild) {
    const member = cache.members.get(message.author.id);
    if (!member) return botCache.helpers.reactError(message);

    const transformed = await botCache.helpers.variables(args.text, member, guild, member);

    try {
      const embedCode = JSON.parse(transformed);
      const embed = new Embed(embedCode);
      const plaintext: string[] = [];
      if (!botCache.vipGuildIDs.has(message.guildID)) {
        plaintext.push(`Sent By: ${member.tag}`);
      }
      if (embedCode.plaintext) plaintext.push(embedCode.plaintext);

      await message.send({
        embed,
        content: plaintext.join("\n"),
      });
      if (botCache.vipGuildIDs.has(message.guildID)) {
        await message.delete().catch();
      }
    } catch (error) {
      const embed = new Embed()
        .setAuthor(member.tag, member.avatarURL)
        .setTitle(translate(message.guildID, `strings:BAD_EMBED`))
        .setDescription(["```js", error, "```"].join("\n"));
      await message.send({ embed });
    }
  },
});
