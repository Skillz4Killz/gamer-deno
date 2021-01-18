import {
  botCache,
  botID,
  ChannelTypes,
  createGuildChannel,
  OverwriteType,
} from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("setup", {
	name: "logs",
	description: "https://gamer.mod.land/docs/logs.html",
  botServerPermissions: ["ADMINISTRATOR"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
  execute: async function (message, args, guild) {
    if (!message.guild) return;

    const category = await createGuildChannel(
      message.guild,
      translate(message.guildID, "strings:SERVER_LOGS"),
      {
        type: ChannelTypes.GUILD_CATEGORY,
        permissionOverwrites: [
          {
            id: message.guildID,
            type: OverwriteType.ROLE,
            allow: [],
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: botID,
            type: OverwriteType.MEMBER,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
            deny: [],
          },
        ],
      },
    );
    if (!category) return await botCache.helpers.reactError(message);

    const [
      automodChannel,
      moderationChannel,
      publicChannel,
      bansChannel,
      rolesChannel,
      joinChannel,
      leaveChannel,
      nicknamesChannel,
      messagesChannel,
      emojisChannel,
      channelsChannel,
      voiceChannel,
      imagesChannel,
    ] = await Promise
      .all([
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:AUTOMODERATION"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:MODERATION"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:PUBLIC"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:BANS"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:ROLES"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:JOIN"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:LEAVE"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:NICKNAMES"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:MESSAGES"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:EMOJIS"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:CHANNELS"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:VOICE"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
        createGuildChannel(
          message.guild,
          translate(message.guildID, "strings:IMAGES"),
          {
            nsfw: true,
            parent_id: category.id,
          },
        ),
      ]);

    await db.serverlogs.update(message.guildID, {
      // BASIC LOGS
      automodChannelID: automodChannel.id,
      modChannelID: moderationChannel.id,
      publicChannelID: publicChannel.id,

      // SERVER LOGS

      banAddChannelID: bansChannel.id,
      banRemoveChannelID: bansChannel.id,
      roleCreateChannelID: rolesChannel.id,
      roleDeleteChannelID: rolesChannel.id,
      roleUpdateChannelID: rolesChannel.id,
      roleMembersChannelID: rolesChannel.id,
      memberAddChannelID: joinChannel.id,
      memberRemoveChannelID: leaveChannel.id,
      memberNickChannelID: nicknamesChannel.id,
      messageDeleteChannelID: messagesChannel.id,
      messageEditChannelID: messagesChannel.id,
      emojiCreateChannelID: emojisChannel.id,
      emojiDeleteChannelID: emojisChannel.id,
      channelCreateChannelID: channelsChannel.id,
      channelDeleteChannelID: channelsChannel.id,
      channelUpdateChannelID: channelsChannel.id,
      voiceJoinChannelID: voiceChannel.id,
      voiceLeaveChannelID: voiceChannel.id,
      imageChannelID: imagesChannel.id,

      // DEFAULT PUBLIC SETTINGS
      banAddPublic: botCache.vipGuildIDs.has(message.guildID) ? true : false,
      banRemovePublic: botCache.vipGuildIDs.has(message.guildID) ? true : false,
      roleCreatePublic: botCache.vipGuildIDs.has(message.guildID)
        ? true
        : false,
      roleDeletePublic: botCache.vipGuildIDs.has(message.guildID)
        ? true
        : false,
      roleUpdatePublic: botCache.vipGuildIDs.has(message.guildID)
        ? true
        : false,
      roleMembersPublic: botCache.vipGuildIDs.has(message.guildID) ? true
      : false,
      memberAddPublic: botCache.vipGuildIDs.has(message.guildID) ? true : false,
      memberRemovePublic: botCache.vipGuildIDs.has(message.guildID) ? true
      : false,
      memberNickPublic: botCache.vipGuildIDs.has(message.guildID) ? true
      : false,
      messageDeletePublic: botCache.vipGuildIDs.has(message.guildID) ? true
      : false,
      messageEditPublic: botCache.vipGuildIDs.has(message.guildID) ? true
      : false,
      emojiCreatePublic: botCache.vipGuildIDs.has(message.guildID) ? true
      : false,
      emojiDeletePublic: botCache.vipGuildIDs.has(message.guildID) ? true
      : false,
      channelCreatePublic: botCache.vipGuildIDs.has(message.guildID) ? true
      : false,
      channelDeletePublic: botCache.vipGuildIDs.has(message.guildID) ? true
      : false,
      channelUpdatePublic: botCache.vipGuildIDs.has(message.guildID) ? true
      : false,
      voiceJoinPublic: botCache.vipGuildIDs.has(message.guildID) ? true : false,
      voiceLeavePublic: botCache.vipGuildIDs.has(message.guildID) ? true
      : false,

      // IGNORED SETTINGS PLACEHOLDERS
      messageDeleteIgnoredChannelIDs: [],
      messageDeleteIgnoredRoleIDs: [],
      messageEditIgnoredChannelIDs: [],
      messageEditIgnoredRoleIDs: [],
      channelUpdateIgnoredChannelIDs: [],
      voiceJoinIgnoredChannelIDs: [],
      voiceLeaveIgnoredChannelIDs: [],
      imageIgnoredChannelIDs: [],
      imageIgnoredRoleIDs: [],
    });

    await botCache.helpers.reactSuccess(message);
  },
});
