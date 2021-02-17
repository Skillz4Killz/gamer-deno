import { botCache, botID, cache, getMessage } from "../../../../deps.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("embed", {
  name: "show",
  aliases: ["s"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
    { name: "messageID", type: "snowflake" },
  ] as const,
  execute: async function (message, args) {
    const channel =
      botCache.vipGuildIDs.has(message.guildID) && args.channel ? args.channel : cache.channels.get(message.channelID);
    if (!channel) return botCache.helpers.reactError(message);

    const messageToUse = cache.messages.get(args.messageID) || (await getMessage(channel.id, args.messageID));
    if (!messageToUse || messageToUse.author.id !== botID) {
      return botCache.helpers.reactError(message);
    }

    const [embed] = messageToUse.embeds;
    if (!embed) return;

    const payload: string[] = [];
    const fields =
      embed.fields && embed.fields.length
        ? embed.fields.map(
            (field) =>
              `{ "name": "${field.name}", "value": "${field.value.split("\n").join("\\n")}", "inline": ${field.inline}}`
          )
        : [];
    if (embed.title) payload.push(`"title": "${embed.title}"`);
    if (embed.description) {
      payload.push(`"description": "${embed.description.split("\n").join("\\n")}"`);
    }
    if (embed.color) payload.push(`"color": ${embed.color}`);
    if (embed.author) {
      let author = `"author": { "name": "${embed.author.name}"`;
      if (embed.author.icon_url) {
        author += `, "icon_url": "${embed.author.icon_url}"`;
      }
      if (embed.author.url) author += `, "url": "${embed.author.url}"`;
      author += ` }`;

      payload.push(author);
    }
    if (fields.length) payload.push(`"fields": [${fields.join(", ")}]`);
    if (embed.url) payload.push(`"url": "${embed.url}"`);
    if (embed.thumbnail) {
      payload.push(`"thumbnail": { "url": "${embed.thumbnail.url}" }`);
    }
    if (embed.image) payload.push(`"image": { "url": "${embed.image.url}" }`);
    if (embed.timestamp) payload.push(`"timestamp": ${embed.timestamp}`);
    if (embed.footer) {
      let footer = `"footer": { "text": "${embed.footer.text}"`;
      if (embed.footer.icon_url) {
        footer += `, "icon_url": "${embed.footer.icon_url}"`;
      }
      footer += ` }`;
      payload.push(footer);
    }

    let finaltext = payload.join(", ");
    const text = ["```json", `{${finaltext}}`, "```"].join("\n");

    if (text.length < 2000) {
      return message.send({ embed: new Embed().setDescription(text) });
    }

    while (finaltext.length >= 0) {
      const partial = finaltext.substring(0, 2000);
      const text = ["```json", `{${partial}}`, "```"].join("\n");
      await message.send({ embed: new Embed().setDescription(text) });
      finaltext = finaltext.substring(2000);
    }
  },
});
