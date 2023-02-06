import { botCache, cache, guildIconURL, rawAvatarURL } from "../../deps.ts";
import { db } from "../database/database.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.messageDelete = async function (partial, message) {
  // UPDATE STATS
  botCache.stats.messagesDeleted += 1;

  if (!message?.guildID) return;

  // VIP ONLY GETS SERVER LOGS
  if (!botCache.vipGuildIDs.has(message.guildID)) return;

  // SERVER LOGS
  const logs = botCache.recentLogs.has(message.guildID)
    ? botCache.recentLogs.get(message.guildID)
    : await db.serverlogs.get(message.guildID);
  botCache.recentLogs.set(message.guildID, logs);
  // DISABLED LOGS
  if (!logs?.messageDeleteChannelID) return;
  if (logs.messageDeleteIgnoredChannelIDs?.includes(message.channelID)) {
    return;
  }
  const member = cache.members.get(message.author.id)?.guilds.get(message.guildID);
  if (logs.messageDeleteIgnoredRoleIDs?.some((id) => member?.roles.includes(id))) {
    return;
  }

  const texts = [
    translate(message.guildID, "strings:MESSAGE_DELETED", { id: message.id }),
    translate(message.guildID, "strings:USER", {
      tag: `<@!${message.author.id}>`,
      id: message.author.id,
    }),
    translate(message.guildID, "strings:MESSAGE_ID", { id: message.id }),
    translate(message.guildID, "strings:CHANNEL", {
      channel: `<#${message.channelID}>`,
    }),
  ];

  const embed = botCache.helpers
    .authorEmbed(message)
    .setDescription(texts.join("\n"))
    .setFooter(
      `${message.author.username}#${message.author.discriminator}`,
      message.guild ? guildIconURL(message.guild) : ""
    )
    .setThumbnail(rawAvatarURL(message.author.id, message.author.discriminator))
    .setTimestamp();

  if (logs.messageDeletePublic) await sendEmbed(logs.publicChannelID, embed);

  embed.setThumbnail(rawAvatarURL(message.author.id, message.author.discriminator, message.author.avatar));

  const [attachment] = message.attachments;
  if (attachment) {
    const buffer = await fetch(attachment.url)
      .then((res) => res.blob())
      .catch(console.log);
    if (buffer) embed.attachFile(buffer, attachment.filename);
  }

  if (message.content) {
    embed.addField(translate(message.guildID, `strings:MESSAGE_CONTENT`), message.content.substring(0, 1024));
    if (message.content.length > 1024) {
      embed.addField(translate(message.guildID, `strings:MESSAGE_CONTENT_CONTINUED`), message.content.substring(1024));
    }
  }

  return sendEmbed(logs.messageDeleteChannelID, embed);
};
