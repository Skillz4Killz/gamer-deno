import { botCache, botID, cache, ChannelTypes, createGuildChannel, OverwriteType } from "../../../../deps.ts";
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
  arguments: [{ name: "guild", type: "guild", required: false }] as const,
  execute: async function (message, args) {
    let guild = message.guild;
    if (args.guild) {
      // ONLY VIPS CAN USE OTHER GUILD
      if (!botCache.vipGuildIDs.has(message.guildID)) {
        return botCache.helpers.reactError(message, true);
      }

      guild = cache.guilds.get(message.guildID);
    }
    if (!guild) return;

    const category = await createGuildChannel(guild, translate(guild.id, "strings:SERVER_LOGS"), {
      type: ChannelTypes.GUILD_CATEGORY,
      permissionOverwrites: [
        {
          id: guild.id,
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
    });

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
    ] = await Promise.all([
      createGuildChannel(guild, translate(guild.id, "strings:AUTOMODERATION"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:MODERATION"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:PUBLIC"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:BANS"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:ROLES"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:JOIN"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:LEAVE"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:NICKNAMES"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:MESSAGES"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:EMOJIS"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:CHANNELS"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:VOICE"), {
        nsfw: true,
        parent_id: category.id,
      }),
      createGuildChannel(guild, translate(guild.id, "strings:IMAGES"), {
        nsfw: true,
        parent_id: category.id,
      }),
    ]);

    await db.serverlogs.update(guild.id, {
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
      banAddPublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      banRemovePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      roleCreatePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      roleDeletePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      roleUpdatePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      roleMembersPublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      memberAddPublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      memberRemovePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      memberNickPublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      messageDeletePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      messageEditPublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      emojiCreatePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      emojiDeletePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      channelCreatePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      channelDeletePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      channelUpdatePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      voiceJoinPublic: botCache.vipGuildIDs.has(guild.id) ? true : false,
      voiceLeavePublic: botCache.vipGuildIDs.has(guild.id) ? true : false,

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

    return botCache.helpers.reactSuccess(message);
  },
});
