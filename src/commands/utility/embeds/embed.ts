import { botCache, cache, deleteMessage } from "../../../../deps.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createCommand, sendEmbed } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createCommand({
  name: "embed",
  guildOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "text", type: "...string" },
  ],
  execute: async function (message, args: EmbedArgs, guild) {
    const member = cache.members.get(message.author.id);
    if (!member) return botCache.helpers.reactError(message);

    const transformed = await botCache.helpers.variables(
      args.text,
      member,
      guild,
      member,
    );

    try {
      const embedCode = JSON.parse(transformed);
      const embed = new Embed(embedCode);
      let plaintext = `Sent By: ${member.tag}`;
      if (embedCode.plaintext) plaintext += `\n${embedCode.plaintext}`;
      else if (embedCode.plainText) plaintext += `\n${embedCode.plainText}`;

      sendEmbed(
        message.channelID,
        embed,
        `Sent By: ${member?.tag ||
          message.author.username}${plaintext}`,
      );
      if (botCache.vipGuildIDs.has(message.guildID)) {
        deleteMessage(message).catch();
      }
    } catch (error) {
      const embed = new Embed()
        .setAuthor(member.tag, member.avatarURL)
        .setTitle(translate(message.guildID, `embedding/embed:BAD_EMBED`))
        .setDescription(["```js", error, "```"].join("\n"));
      sendEmbed(message.channelID, embed);
    }
  },
});

interface EmbedArgs {
  text: string;
}
