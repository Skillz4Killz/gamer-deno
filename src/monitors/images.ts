import { botCache, cache } from "../../deps.ts";
import { db } from "../database/database.ts";
import { sendEmbed } from "../utils/helpers.ts";

botCache.monitors.set("images", {
  name: "images",
  execute: async function (message) {
    // VIP ONLY
    if (!botCache.vipGuildIDs.has(message.guildID)) return;

    const logs = botCache.recentLogs.has(message.guildID)
      ? botCache.recentLogs.get(message.guildID)
      : await db.serverlogs.get(message.guildID);

    botCache.recentLogs.set(message.guildID, logs);
    // LOGS DISABLED
    if (!logs?.imageChannelID) return;
    // IGNORED CHANNEL IDS
    if (logs.imageIgnoredChannelIDs.includes(message.channelID)) return;
    // IGNORED ROLES
    if (logs.imageIgnoredRoleIDs.length) {
      const member = cache.members.get(message.author.id);
      if (
        member?.guilds.get(message.guildID)?.roles.some((id) =>
          logs.imageIgnoredRoleIDs.includes(id)
        )
      ) {
        return;
      }
    }

    message.attachments.forEach(async (attachment) => {
      const blob = await fetch(attachment.url).then((res) => res.blob()).catch(
        console.log,
      );
      if (blob) {
        await sendEmbed(
          logs.imageChannelID,
          botCache.helpers.authorEmbed(message).attachFile(
            blob,
            attachment.filename,
          ),
        )?.catch(console.log);
      }
    });

    message.embeds.forEach(async (embed) => {
      if (
        !embed.url || !embed.thumbnail?.url || embed.url !== embed.thumbnail.url
      ) {
        return;
      }

      const blob = await fetch(embed.url).then((res) => res.blob()).catch(
        console.log,
      );
      if (blob) {
        await sendEmbed(
          logs.imageChannelID,
          botCache.helpers.authorEmbed(message).attachFile(
            blob,
            `image${embed.url.substring(embed.url.lastIndexOf("."))}`,
          ),
        )?.catch(console.log);
      }
    });
  },
});
