import { botCache, cache, Message, rawAvatarURL } from "../../deps.ts";
import { db } from "../database/database.ts";
import { translate } from "../utils/i18next.ts";
import { sendEmbed } from "../utils/helpers.ts";

botCache.eventHandlers.messageDelete = async function (message) {
  // UPDATE STATS
  botCache.stats.messagesDeleted += 1;

  // @ts-ignore
  if (message.guildID) return;

  const fullMessage = message as Message;
  // VIP ONLY GETS SERVER LOGS
  if (!botCache.vipGuildIDs.has(fullMessage.guildID)) return;

  // SERVER LOGS
  const logs = botCache.recentLogs.has(fullMessage.guildID)
    ? botCache.recentLogs.get(fullMessage.guildID)
    : await db.serverlogs.get(fullMessage.guildID);
  botCache.recentLogs.set(fullMessage.guildID, logs);
  // DISABLED LOGS
  if (!logs?.messageDeleteChannelID) return;
  if (
    logs.messageDeleteIgnoredChannelIDs?.includes(fullMessage.channelID)
  ) {
    return;
  }
  const member = cache.members.get(fullMessage.author.id)?.guilds.get(
    fullMessage.guildID,
  );
  if (
    logs.messageDeleteIgnoredRoleIDs?.some((id) => member?.roles.includes(id))
  ) {
    return;
  }

  const texts = [
    translate(
      fullMessage.guildID,
      "strings:MESSAGE_DELETED",
      { id: message.id },
    ),
    translate(
      fullMessage.guildID,
      "strings:CHANNEL",
      { channel: `<#${fullMessage.channelID}>` },
    ),
  ];

  const embed = botCache.helpers.authorEmbed(fullMessage)
    .setDescription(texts.join("\n"))
    .setTimestamp();

  if (logs.messageDeletePublic) await sendEmbed(logs.publicChannelID, embed);

  embed
    .setThumbnail(
      rawAvatarURL(
        fullMessage.author.id,
        fullMessage.author.discriminator,
        fullMessage.author.avatar,
      ),
    );

  const [attachment] = fullMessage.attachments;
  if (attachment) {
    const buffer = await fetch(attachment.url)
      .then((res) => res.blob())
      .catch(console.log);
    if (buffer) embed.attachFile(buffer, attachment.filename);
  }

  if (fullMessage.content) {
    embed.addField(
      translate(fullMessage.guildID, `strings:MESSAGE_CONTENT`),
      fullMessage.content.substring(0, 1024),
    );
    if (fullMessage.content.length > 1024) {
      embed.addField(
        translate(fullMessage.guildID, `strings:MESSAGE_CONTENT_CONTINUED`),
        fullMessage.content.substring(1024),
      );
    }
  }

  return sendEmbed(logs.messageDeleteChannelID, embed);
};
