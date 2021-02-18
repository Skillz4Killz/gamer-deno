import { botCache, cache, guildIconURL, rawAvatarURL } from "../../deps.ts";
import { db } from "../database/database.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.messageUpdate = async function (message, cachedMessage) {
  // Update stats in cache
  botCache.stats.messagesEdited += 1;
  // VIP ONLY
  if (!botCache.vipGuildIDs.has(message.guildID)) return;

  // No change in content so ignore.
  if (cachedMessage.content === message.content) return;

  const logs = botCache.recentLogs.has(message.guildID)
    ? botCache.recentLogs.get(message.guildID)
    : await db.serverlogs.get(message.guildID);
  botCache.recentLogs.set(message.guildID, logs);
  // DISABLED LOGS
  if (!logs?.messageEditChannelID) return;
  if (logs.messageEditIgnoredChannelIDs?.includes(message.channelID)) return;
  const member = cache.members.get(message.author.id)?.guilds.get(message.guildID);
  if (logs.messageEditIgnoredRoleIDs?.some((id) => member?.roles.includes(id))) {
    return;
  }

  const texts = [
    translate(message.guildID, "strings:MESSAGE_EDITED"),
    translate(message.guildID, "strings:USER", {
      tag: `<@!${message.author.id}>`,
      id: message.author.id,
    }),
    translate(message.guildID, "strings:MESSAGE_ID", { id: message.id }),
    translate(message.guildID, "strings:CHANNEL", {
      channel: `<#${message.channelID}>`,
    }),
    translate(message.guildID, "strings:LINK_TO_MESSAGE", {
      link: message.link,
    }),
  ];
  const embed = botCache.helpers
    .authorEmbed(message)
    .setDescription(texts.join("\n"))
    .setFooter(
      `${message.author.username}#${message.author.discriminator}`,
      message.guild ? guildIconURL(message.guild) : ""
    )
    .setThumbnail(rawAvatarURL(message.author.id, message.author.discriminator, message.author.avatar))
    .setTimestamp();

  if (cachedMessage && cachedMessage.content.length) {
    embed.addField(translate(message.guildID, `strings:OLD_CONTENT`), cachedMessage.content.substring(0, 1024));
    if (cachedMessage.content.length > 1024) {
      embed.addField(
        translate(message.guildID, `strings:MESSAGE_CONTENT_CONTINUED`),
        cachedMessage.content.substring(1024)
      );
    }
  }

  if (message && message.content.length) {
    embed.addField(translate(message.guildID, `strings:NEW_CONTENT`), message.content.substring(0, 1024));
    if (message.content.length > 1024) {
      embed.addField(translate(message.guildID, `strings:MESSAGE_CONTENT_CONTINUED`), message.content.substring(1024));
    }
  }

  if (botCache.vipGuildIDs.has(message.guildID) && logs.messageEditPublic) {
    await sendEmbed(logs.publicChannelID, embed);
  }

  return sendEmbed(logs.messageEditChannelID, embed);
};
