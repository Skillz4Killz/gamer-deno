import type { Channel, Guild } from "../../../deps.ts";

import {
  botHasChannelPermissions,
  botID,
  cache,
  createWebhook,
  getWebhook,
  Permissions,
} from "../../../deps.ts";
import { createSubcommand, sendResponse } from "../../utils/helpers.ts";
import { botCache } from "../../../cache.ts";
import { translate } from "../../utils/i18next.ts";
import { db } from "../../database/database.ts";

createSubcommand("mirrors", {
  name: "create",
  arguments: [
    // Other guild option
    { name: "guild", type: "guild", required: false },
    // The same guild channel
    { name: "channel", type: "guildtextchannel", required: false },
    // This is when u need to provide a channel id from another guild
    { name: "channelID", type: "string", required: false },
  ],
  execute: async (message, args: MirrorCreateArgs, guild) => {
    // Using multiple guilds require vip features
    if (args.guild && !botCache.vipGuildIDs.has(message.guildID)) {
      return sendResponse(
        message,
        translate(message.guildID, "common:NEED_VIP"),
      );
    }

    const botMember = guild?.members.get(botID);
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

      if (
        !botHasChannelPermissions(
          mirrorChannel.id,
          [
            Permissions.MANAGE_WEBHOOKS,
            Permissions.VIEW_CHANNEL,
            Permissions.SEND_MESSAGES,
          ],
        )
      ) {
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
    const guildSettings = await db.guilds.get(
      { guildID: message.guildID },
    );
    if (!botCache.helpers.isAdmin(message, guildSettings)) {
      return botCache.helpers.reactError(message);
    }

    const webhookExists = await db.mirrors.get(mirrorChannel.id);
    const validWebhook = webhookExists
      ? await getWebhook(webhookExists.webhookID).catch(() => undefined)
      : undefined;

    sendResponse(
      message,
      translate(message.guildID, "commands/mirror:REQUIRE_IMAGES"),
    );

    // All requirements passed time to create a webhook.
    const webhook = !validWebhook
      ? await createWebhook(
        mirrorChannel.id,
        { name: "Gamer Mirror", avatar: botMember.avatarURL },
      )
      : undefined;

    await db.mirrors.create(message.id, {
      sourceChannelID: message.channelID,
      mirrorChannelID: mirrorChannel.id,
      sourceGuildID: message.guildID,
      mirrorGuildID: mirrorChannel.guildID,
      webhookToken: webhookExists?.webhookToken || webhook!.token,
      webhookID: webhookExists?.webhookID || webhook!.id,
      filterImages: false,
    });

    // TODO: optimize this
    const mirrorSettings = await db.mirrors.getAll(true).then((mirrors) =>
      mirrors.channelID === message.channelID &&
      mirrors.mirrorChannelID === mirrorChannel!.id
    );
    if (!mirrorSettings) return;

    // Add in cache
    const mirror = botCache.mirrors.get(message.channelID);
    if (mirror) {
      mirror.push(mirrorSettings);
    } else {
      botCache.mirrors.set(message.channelID, [mirrorSettings]);
    }

    return botCache.helpers.reactSuccess(message);
  },
});

interface MirrorCreateArgs {
  guild?: Guild;
  channel?: Channel;
  channelID?: string;
}
