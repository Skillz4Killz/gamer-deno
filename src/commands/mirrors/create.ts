import { botCache, botHasChannelPermissions, botID, cache, createWebhook, getWebhook } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { createSubcommand } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createSubcommand("mirrors", {
  name: "create",
  arguments: [
    // Other guild option
    { name: "guild", type: "guild", required: false },
    // The same guild channel
    { name: "channel", type: "guildtextchannel", required: false },
    // This is when u need to provide a channel id from another guild
    { name: "channelID", type: "string", required: false },
  ] as const,
  execute: async (message, args) => {
    // Using multiple guilds require vip features
    if (args.guild && !botCache.vipGuildIDs.has(message.guildID)) {
      return message.reply(translate(message.guildID, "strings:NEED_VIP"));
    }

    const botMember = cache.members.get(botID);
    if (!botMember) return;

    let mirrorChannel = args.channel;

    // This is a vip guild
    if (args.guild) {
      // A guild was provided but a channel id was not
      if (!args.channelID) {
        return botCache.helpers.reactError(message);
      }

      // Reassign the guild channel
      mirrorChannel = cache.channels.get(args.channelID);
      if (!mirrorChannel) {
        return botCache.helpers.reactError(message);
      }

      if (!(await botHasChannelPermissions(mirrorChannel.id, ["MANAGE_WEBHOOKS", "VIEW_CHANNEL", "SEND_MESSAGES"]))) {
        return botCache.helpers.reactError(message);
      }

      // Extra layer of security to prevent abuse
      const targetGuildSettings = await db.guilds.get(args.guild.id);

      if (!botCache.helpers.isAdmin(message, targetGuildSettings)) {
        return botCache.helpers.reactError(message);
      }
    }

    if (!mirrorChannel) {
      return botCache.helpers.reactError(message);
    }

    // Is the user an admin on this server?
    const guildSettings = await db.guilds.get(message.guildID);
    if (!botCache.helpers.isAdmin(message, guildSettings)) {
      return botCache.helpers.reactError(message);
    }

    const webhookExists = await db.mirrors.get(mirrorChannel.id);
    const validWebhook = webhookExists ? await getWebhook(webhookExists.webhookID) : undefined;

    // All requirements passed time to create a webhook.
    const webhook = !validWebhook
      ? await createWebhook(mirrorChannel.id, {
          name: "Gamer Mirror",
          avatar: botMember.avatarURL,
        })
      : undefined;

    await db.mirrors.create(message.id, {
      id: message.id,
      sourceChannelID: message.channelID,
      mirrorChannelID: mirrorChannel.id,
      sourceGuildID: message.guildID,
      mirrorGuildID: mirrorChannel.guildID,
      webhookToken: webhookExists?.webhookToken || webhook!.token!,
      webhookID: webhookExists?.webhookID || webhook!.id,
      filterImages: false,
      deleteSourceMessages: false,
      anonymous: false,
    });

    const mirrorSettings = await db.mirrors.findMany(
      (mirror) => mirror.sourceChannelID === message.channelID && mirror.mirrorChannelID === mirrorChannel!.id,
      true
    );
    if (!mirrorSettings) return;

    // Add in cache
    botCache.mirrors.set(message.channelID, mirrorSettings);

    return botCache.helpers.reactSuccess(message);
  },
});
