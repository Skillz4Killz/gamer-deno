import { botID, cache, editMessage, getMessage } from "../../../../deps.ts";
import { botCache } from "../../../../deps.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import {
  createSubcommand,
  sendAlertResponse,
  sendEmbed,
} from "../../../utils/helpers.ts";
import { Embed } from "../../../utils/Embed.ts";

createSubcommand("embed", {
  name: "edit",
  aliases: ["e"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  guildOnly: true,
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
    { name: "messageID", type: "snowflake" },
    { name: "text", type: "...string" },
  ] as const,
  execute: async function (message, args, guild) {
    const channel = botCache.vipGuildIDs.has(message.guildID) && args.channel
      ? args.channel
      : cache.channels.get(message.channelID);
    if (!channel) return botCache.helpers.reactError(message);

    const messageToUse = cache.messages.get(args.messageID) ||
      await getMessage(channel.id, args.messageID).catch(console.log);
    if (!messageToUse || messageToUse.author.id !== botID) {
      return botCache.helpers.reactError(message);
    }

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

      editMessage(messageToUse, { content: plaintext, embed });
      await sendAlertResponse(
        message,
        `https://discord.com/channels/${message.guildID}/${messageToUse.channelID}/${messageToUse.id}`,
      );
    } catch (error) {
      const embed = new Embed()
        .setAuthor(member.tag, member.avatarURL)
        .setDescription(["```js", error, "```"].join("\n"));
      return sendEmbed(message.channelID, embed);
    }
  },
});
