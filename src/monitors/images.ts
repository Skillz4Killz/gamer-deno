import { bgBlue, bgYellow, black, botCache, cache } from "../../deps.ts";
import { db } from "../database/database.ts";
import { getTime, sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.monitors.set("images", {
  name: "images",
  execute: async function (message) {
    // VIP ONLY
    if (!botCache.vipGuildIDs.has(message.guildID)) return;

    // First check if the message has an attachment or embed
    if (!message.attachments.length && !message.embeds.length) return;

    const logs = botCache.recentLogs.has(message.guildID)
      ? botCache.recentLogs.get(message.guildID)
      : await db.serverlogs.get(message.guildID);

    botCache.recentLogs.set(message.guildID, logs);
    // LOGS DISABLED
    if (!logs?.imageChannelID) return;
    // IGNORED CHANNEL IDS
    if (logs.imageIgnoredChannelIDs?.includes(message.channelID)) return;
    // IGNORED ROLES
    if (logs.imageIgnoredRoleIDs?.length) {
      const member = cache.members.get(message.author.id);
      if (member?.guilds.get(message.guildID)?.roles.some((id) => logs.imageIgnoredRoleIDs?.includes(id))) {
        return;
      }
    }

    console.log(`${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("images"))}] Processing.`);

    const embed = botCache.helpers.authorEmbed(message).setDescription([
      translate(message.guildID, "strings:CHANNEL", {
        channel: `<#${message.channelID}>`,
      }),
      translate(message.guildID, "strings:USER", {
        tag: message.member?.tag || message.author.username,
        id: message.author.id,
      }),
      translate(message.guildID, "strings:MESSAGE_ID", {
        id: message.id,
      }),
      translate(message.guildID, "strings:LINK_TO_MESSAGE", {
        link: message.link,
      }),
    ]);

    for (const attachment of message.attachments) {
      const blob = await fetch(attachment.url)
        .then((res) => res.blob())
        .catch(console.log);
      if (blob) {
        await sendEmbed(logs.imageChannelID, embed.attachFile(blob, attachment.filename));
      }
    }

    for (const em of message.embeds) {
      if (!em.url || !em.thumbnail?.url || em.url !== em.thumbnail.url) {
        return;
      }

      const blob = await fetch(em.url)
        .then((res) => res.blob())
        .catch(console.log);
      if (blob) {
        await sendEmbed(
          logs.imageChannelID,
          embed.attachFile(blob, `image${em.url.substring(em.url.lastIndexOf("."))}`)
        );
      }
    }
  },
});
