import { createSubcommand, sendResponse } from "../../utils/helpers.ts";
import {
  avatarURL,
  botID,
  Guild,
  Channel,
  cache,
  addReaction,
  botHasChannelPermissions,
  Permissions,
  guildsDatabase,
  getWebhook,
  createWebhook,
} from "../../../deps.ts";
import { botCache } from "../../../mod.ts";
import { translate } from "../../utils/i18next.ts";
import { mirrorsDatabase } from "../../database/schemas/mirrors.ts";

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
        return addReaction(message.channelID, message.id, "❌");
      }

      // Reassign the guild channel
      mirrorChannel = cache.channels.get(args.channelID);
      if (!mirrorChannel) {
        return addReaction(message.channelID, message.id, "❌");
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
        return addReaction(message.channelID, message.id, "❌");
      }

      // Extra layer of security to prevent abuse
      const targetGuildSettings = await guildsDatabase.findOne(
        { guildID: args.guild.id },
      );

      if (!botCache.helpers.isAdmin(message, targetGuildSettings)) {
        return addReaction(message.channelID, message.id, "❌");
      }
    }

    if (!mirrorChannel) {
      return addReaction(message.channelID, message.id, "❌");
    }

    // Is the user an admin on this server?
    const guildSettings = await guildsDatabase.findOne(
      { guildID: message.guildID },
    );
    if (!botCache.helpers.isAdmin(message, guildSettings)) {
      return addReaction(message.channelID, message.id, "❌");
    }

    const webhookExists = await mirrorsDatabase.findOne(
      { mirrorChannelID: mirrorChannel.id },
    );
    const validWebhook = webhookExists
      ? await getWebhook(webhookExists.webhookID).catch(() => undefined)
      : undefined;

    sendResponse(
      message,
      translate(message.guildID, "commands/mirror:REQUIRE_IMAGES"),
    );
    const onlyImages = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (!onlyImages) return addReaction(message.channelID, message.id, "❌");

    // All requirements passed time to create a webhook.
    const webhook = !validWebhook
      ? await createWebhook(
        mirrorChannel.id,
        { name: "Gamer Mirror", avatar: avatarURL(botMember) },
      )
      : undefined;

    await mirrorsDatabase.insertOne({
      sourceChannelID: message.channel.id,
      mirrorChannelID: mirrorChannel.id,
      sourceGuildID: message.guildID,
      mirrorGuildID: mirrorChannel.guildID,
      webhookToken: webhookExists?.webhookToken || webhook!.token,
      webhookID: webhookExists?.webhookID || webhook!.id,
      filterImages: onlyImages.content === "yes",
    });

    const mirrorSettings = await mirrorsDatabase.findOne(
      { sourceChannelID: message.channelID, mirrorChannelID: mirrorChannel.id },
    );
    if (!mirrorSettings) return;

    // Add in cache
    const mirror = botCache.mirrors.get(message.channelID);
    if (mirror) {
      mirror.push(mirrorSettings);
    } else {
      botCache.mirrors.set(message.channelID, [mirrorSettings]);
    }

    return addReaction(
      message.channelID,
      message.id,
      botCache.constants.emojis.success,
    );
  },
});

interface MirrorCreateArgs {
  guild?: Guild;
  channel?: Channel;
  channelID?: string;
}
