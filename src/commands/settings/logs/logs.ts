import { botCache, cache, memberIDHasPermission } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

const logData = [
  {
    name: "banadd",
    aliases: ["ba"],
    channelName: "banAddChannelID",
    publicName: "banAddPublic",
    ignoredChannelName: "",
  },
  {
    name: "banremove",
    aliases: ["br"],
    channelName: "banRemoveChannelID",
    publicName: "banRemovePublic",
    ignoredChannelName: "",
  },
  {
    name: "rolecreate",
    aliases: ["rc"],
    channelName: "roleCreateChannelID",
    publicName: "roleCreatePublic",
    ignoredChannelName: "",
  },
  {
    name: "roledelete",
    aliases: ["rd"],
    channelName: "roleDeleteChannelID",
    publicName: "roleDeletePublic",
    ignoredChannelName: "",
  },
  {
    name: "roleupdate",
    aliases: ["ru"],
    channelName: "roleUpdateChannelID",
    publicName: "roleUpdatePublic",
    ignoredChannelName: "",
  },
  {
    name: "rolemembers",
    aliases: ["rm"],
    channelName: "roleMembersChannelID",
    publicName: "roleMembersPublic",
    ignoredChannelName: "",
  },
  {
    name: "memberadd",
    aliases: ["ma"],
    channelName: "memberAddChannelID",
    publicName: "memberAddPublic",
    ignoredChannelName: "",
  },
  {
    name: "memberremove",
    aliases: ["mr"],
    channelName: "memberRemoveChannelID",
    publicName: "memberRemovePublic",
    ignoredChannelName: "",
  },
  {
    name: "membernick",
    aliases: ["mn"],
    channelName: "memberNickChannelID",
    publicName: "memberNickPublic",
    ignoredChannelName: "",
  },
  {
    name: "messagedelete",
    aliases: ["md"],
    channelName: "messageDeleteChannelID",
    publicName: "messageDeletePublic",
    ignoredChannelName: "messageDeleteIgnoredChannelIDs",
  },
  {
    name: "messageedit",
    aliases: ["me"],
    channelName: "messageEditChannelID",
    publicName: "messageEditPublic",
    ignoredChannelName: "messageEditIgnoredChannelIDs",
  },
  {
    name: "emojicreate",
    aliases: ["ec"],
    channelName: "emojiCreateChannelID",
    publicName: "emojiCreatePublic",
    ignoredChannelName: "",
  },
  {
    name: "emojidelete",
    aliases: ["ed"],
    channelName: "emojiDeleteChannelID",
    publicName: "emojiDeletePublic",
    ignoredChannelName: "",
  },
  {
    name: "channelcreate",
    aliases: ["cc"],
    channelName: "channelCreateChannelID",
    publicName: "channelCreatePublic",
    ignoredChannelName: "",
  },
  {
    name: "channeldelete",
    aliases: ["cd"],
    channelName: "channelDeleteChannelID",
    publicName: "channelDeletePublic",
    ignoredChannelName: "",
  },
  {
    name: "channelupdate",
    aliases: ["cu"],
    channelName: "channelUpdateChannelID",
    publicName: "channelUpdatePublic",
    ignoredChannelName: "channelUpdateIgnoredChannelIDs",
  },
  {
    name: "voicejoin",
    aliases: ["vj"],
    channelName: "voiceJoinChannelID",
    publicName: "voiceJoinPublic",
    ignoredChannelName: "voiceJoinIgnoredChannelIDs",
  },
  {
    name: "voiceleave",
    aliases: ["vl"],
    channelName: "voiceLeaveChannelID",
    publicName: "voiceLeavePublic",
    ignoredChannelName: "voiceLeaveIgnoredChannelIDs",
  },
] as const;

logData.forEach(function (data) {
  createSubcommand("settings-logs", {
    name: data.name,
    aliases: [...data.aliases],
    permissionLevels: [PermissionLevels.ADMIN],
    arguments: [
      { name: "channelID", type: "snowflake", required: false },
      { name: "channel", type: "guildtextchannel", required: false },
      { name: "reset", type: "string", literals: ["reset"], required: false },
    ] as const,
    execute: async function (message, args) {
      if (args.channelID) {
        // If a snowflake is provided make sure this is a vip server
        if (!botCache.vipGuildIDs.has(message.guildID)) {
          return botCache.helpers.reactError(message, true);
        }
        const channel = cache.channels.get(args.channelID);
        if (!channel) return botCache.helpers.reactError(message);

        // VIP's can set channel ids from other server, make sure the user is an admin on other server
        if (
          !(await memberIDHasPermission(
            message.author.id,
            channel.guildID,
            ["ADMINISTRATOR"],
          ))
        ) {
          return botCache.helpers.reactError(message);
        }

        db.serverlogs.update(
          message.guildID,
          { [data.channelName]: args.channelID },
        );
        return botCache.helpers.reactSuccess(message);
      }

      if (args.reset) {
        db.serverlogs.update(
          message.guildID,
          { [data.channelName]: message.mentionChannels[0]?.id || "" },
        );
        return botCache.helpers.reactSuccess(message);
      }

      if (!args.channel) return botCache.helpers.reactError(message);

      db.serverlogs.update(
        message.guildID,
        { [data.channelName]: args.channel.id },
      );
      botCache.helpers.reactSuccess(message);
    },
  });

  createSubcommand(`settings-logs-${data.name}`, {
    name: "enable",
    aliases: ["on", "enabled"],
    permissionLevels: [PermissionLevels.ADMIN],
    execute: function (message) {
      db.serverlogs.update(
        message.guildID,
        { [data.channelName]: message.channelID },
      );
      botCache.helpers.reactSuccess(message);
    },
  });

  createSubcommand(`settings-logs-${data.name}`, {
    name: "disable",
    aliases: ["off", "disabled"],
    permissionLevels: [PermissionLevels.ADMIN],
    execute: function (message) {
      db.serverlogs.update(message.guildID, { [data.channelName]: "false" });
      botCache.helpers.reactSuccess(message);
    },
  });

  createSubcommand(`settings-logs-${data.name}`, {
    name: "public",
    permissionLevels: [PermissionLevels.ADMIN],
    arguments: [
      { name: "subcommand", type: "subcommand" },
    ],
  });

  createSubcommand(`settings-logs-${data.name}-public`, {
    name: "enable",
    aliases: ["on", "enabled"],
    permissionLevels: [PermissionLevels.ADMIN],
    execute: function (message) {
      db.serverlogs.update(message.guildID, { [data.publicName]: true });
      botCache.helpers.reactSuccess(message);
    },
  });

  createSubcommand(`settings-logs-${data.name}-public`, {
    name: "disable",
    aliases: ["off", "disabled"],
    permissionLevels: [PermissionLevels.ADMIN],
    execute: function (message) {
      db.serverlogs.update(message.guildID, { [data.publicName]: false });
      botCache.helpers.reactSuccess(message);
    },
  });

  if (data.ignoredChannelName) {
    createSubcommand(`settings-logs-${data.name}`, {
      name: "ignore",
      permissionLevels: [PermissionLevels.ADMIN],
      arguments: [
        { name: "channel", type: "guildtextchannel" },
      ] as const,
      execute: async function (message) {
        const logs = await db.serverlogs.get(message.guildID);
        if (!logs) return botCache.helpers.reactError(message);

        db.serverlogs.update(
          message.guildID,
          {
            [data.ignoredChannelName]: [
              ...(logs[data.ignoredChannelName] || []),
            ],
          },
        );
      },
    });

    createSubcommand(`settings-logs-${data.name}`, {
      name: "allow",
      permissionLevels: [PermissionLevels.ADMIN],
      arguments: [
        { name: "channel", type: "guildtextchannel" },
      ] as const,
      execute: async function (message, args) {
        const logs = await db.serverlogs.get(message.guildID);
        if (!logs) return botCache.helpers.reactError(message);

        db.serverlogs.update(
          message.guildID,
          {
            [data.ignoredChannelName]: [
              ...(logs[data.ignoredChannelName] || []),
            ]
              .filter((id) => id !== args.channel.name),
          },
        );
      },
    });
  }
});
