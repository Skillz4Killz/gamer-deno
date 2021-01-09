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
    ignoredRoleName: "",
  },
  {
    name: "banremove",
    aliases: ["br"],
    channelName: "banRemoveChannelID",
    publicName: "banRemovePublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "rolecreate",
    aliases: ["rc"],
    channelName: "roleCreateChannelID",
    publicName: "roleCreatePublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "roledelete",
    aliases: ["rd"],
    channelName: "roleDeleteChannelID",
    publicName: "roleDeletePublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "roleupdate",
    aliases: ["ru"],
    channelName: "roleUpdateChannelID",
    publicName: "roleUpdatePublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "rolemembers",
    aliases: ["rm"],
    channelName: "roleMembersChannelID",
    publicName: "roleMembersPublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "memberadd",
    aliases: ["ma"],
    channelName: "memberAddChannelID",
    publicName: "memberAddPublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "memberremove",
    aliases: ["mr"],
    channelName: "memberRemoveChannelID",
    publicName: "memberRemovePublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "membernick",
    aliases: ["mn"],
    channelName: "memberNickChannelID",
    publicName: "memberNickPublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "messagedelete",
    aliases: ["md"],
    channelName: "messageDeleteChannelID",
    publicName: "messageDeletePublic",
    ignoredChannelName: "messageDeleteIgnoredChannelIDs",
    ignoredRoleName: "messageDeleteIgnoredRoleIDs",
  },
  {
    name: "messageedit",
    aliases: ["me"],
    channelName: "messageEditChannelID",
    publicName: "messageEditPublic",
    ignoredChannelName: "messageEditIgnoredChannelIDs",
    ignoredRoleName: "messageEditIgnoredRoleIDs",
  },
  {
    name: "emojicreate",
    aliases: ["ec"],
    channelName: "emojiCreateChannelID",
    publicName: "emojiCreatePublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "emojidelete",
    aliases: ["ed"],
    channelName: "emojiDeleteChannelID",
    publicName: "emojiDeletePublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "channelcreate",
    aliases: ["cc"],
    channelName: "channelCreateChannelID",
    publicName: "channelCreatePublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "channeldelete",
    aliases: ["cd"],
    channelName: "channelDeleteChannelID",
    publicName: "channelDeletePublic",
    ignoredChannelName: "",
    ignoredRoleName: "",
  },
  {
    name: "channelupdate",
    aliases: ["cu"],
    channelName: "channelUpdateChannelID",
    publicName: "channelUpdatePublic",
    ignoredChannelName: "channelUpdateIgnoredChannelIDs",
    ignoredRoleName: "",
  },
  {
    name: "voicejoin",
    aliases: ["vj"],
    channelName: "voiceJoinChannelID",
    publicName: "voiceJoinPublic",
    ignoredChannelName: "voiceJoinIgnoredChannelIDs",
    ignoredRoleName: "",
  },
  {
    name: "voiceleave",
    aliases: ["vl"],
    channelName: "voiceLeaveChannelID",
    publicName: "voiceLeavePublic",
    ignoredChannelName: "voiceLeaveIgnoredChannelIDs",
    ignoredRoleName: "",
  },
  {
    name: "images",
    aliases: ["im"],
    channelName: "imageChannelID",
    publicName: "",
    ignoredChannelName: "imageIgnoredChannelIDs",
    ignoredRoleName: "imageIgnoredRoleIDs",
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
      // WILL ALLOW THESE TO BE FETCHED WHEN NECESSARY
      botCache.recentLogs.delete(message.guildID);

      if (args.channelID) {
        // If a snowflake is provided make sure this is a vip server
        if (!botCache.vipGuildIDs.has(message.guildID)) {
          return botCache.helpers.reactError(message, true);
        }
        const channel = cache.channels.get(args.channelID);
        if (!channel?.nsfw) return botCache.helpers.reactError(message);

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

        await db.serverlogs.update(
          message.guildID,
          { [data.channelName]: args.channelID },
        );
        return botCache.helpers.reactSuccess(message);
      }

      if (args.reset) {
        await db.serverlogs.update(
          message.guildID,
          { [data.channelName]: message.mentionChannelIDs[0] || "" },
        );
        return botCache.helpers.reactSuccess(message);
      }

      if (!args.channel?.nsfw) return botCache.helpers.reactError(message);

      await db.serverlogs.update(
        message.guildID,
        { [data.channelName]: args.channel.id },
      );
      await botCache.helpers.reactSuccess(message);
    },
  });

  createSubcommand(`settings-logs-${data.name}`, {
    name: "enable",
    aliases: ["on", "enabled"],
    permissionLevels: [PermissionLevels.ADMIN],
    execute: async function (message) {
      // WILL ALLOW THESE TO BE FETCHED WHEN NECESSARY
      botCache.recentLogs.delete(message.guildID);

      await db.serverlogs.update(
        message.guildID,
        { [data.channelName]: message.channelID },
      );
      await botCache.helpers.reactSuccess(message);
    },
  });

  createSubcommand(`settings-logs-${data.name}`, {
    name: "disable",
    aliases: ["off", "disabled"],
    permissionLevels: [PermissionLevels.ADMIN],
    execute: async function (message) {
      // WILL ALLOW THESE TO BE FETCHED WHEN NECESSARY
      botCache.recentLogs.delete(message.guildID);

      await db.serverlogs.update(
        message.guildID,
        { [data.channelName]: "false" },
      );
      await botCache.helpers.reactSuccess(message);
    },
  });

  createSubcommand(`settings-logs-${data.name}`, {
    name: "public",
    permissionLevels: [PermissionLevels.ADMIN],
    arguments: [
      { name: "subcommand", type: "subcommand" },
    ],
  });

  if (data.publicName) {
    createSubcommand(`settings-logs-${data.name}-public`, {
      name: "enable",
      aliases: ["on", "enabled"],
      permissionLevels: [PermissionLevels.ADMIN],
      execute: async function (message) {
        // WILL ALLOW THESE TO BE FETCHED WHEN NECESSARY
        botCache.recentLogs.delete(message.guildID);

        await db.serverlogs.update(
          message.guildID,
          { [data.publicName]: true },
        );
        await botCache.helpers.reactSuccess(message);
      },
    });

    createSubcommand(`settings-logs-${data.name}-public`, {
      name: "disable",
      aliases: ["off", "disabled"],
      permissionLevels: [PermissionLevels.ADMIN],
      execute: async function (message) {
        // WILL ALLOW THESE TO BE FETCHED WHEN NECESSARY
        botCache.recentLogs.delete(message.guildID);

        await db.serverlogs.update(
          message.guildID,
          { [data.publicName]: false },
        );
        await botCache.helpers.reactSuccess(message);
      },
    });
  }

  if (data.ignoredChannelName) {
    createSubcommand(`settings-logs-${data.name}`, {
      name: "ignore",
      permissionLevels: [PermissionLevels.ADMIN],
      arguments: [
        { name: "channel", type: "guildtextchannel", required: false },
        { name: "role", type: "role", required: false },
      ] as const,
      execute: async function (message, args) {
        if (!args.role && !args.channel) {
          return botCache.helpers.reactError(message);
        }

        const logs = await db.serverlogs.get(message.guildID);
        if (!logs) return botCache.helpers.reactError(message);

        // WILL ALLOW THESE TO BE FETCHED WHEN NECESSARY
        botCache.recentLogs.delete(message.guildID);

        if (data.ignoredRoleName && args.role) {
          await db.serverlogs.update(message.guildID, {
            [data.ignoredRoleName]: [
              ...(logs[data.ignoredRoleName] || []),
              args.role.id,
            ],
          });
        }

        if (args.channel) {
          await db.serverlogs.update(
            message.guildID,
            {
              [data.ignoredChannelName]: [
                ...(logs[data.ignoredChannelName] || []),
                args.channel.id,
              ],
            },
          );
        }
      },
    });

    createSubcommand(`settings-logs-${data.name}`, {
      name: "allow",
      permissionLevels: [PermissionLevels.ADMIN],
      arguments: [
        { name: "channel", type: "guildtextchannel", required: false },
        { name: "role", type: "role", required: false },
      ] as const,
      execute: async function (message, args) {
        if (!args.role && !args.channel) {
          return botCache.helpers.reactError(message);
        }

        const logs = await db.serverlogs.get(message.guildID);
        if (!logs) return botCache.helpers.reactError(message);

        // WILL ALLOW THESE TO BE FETCHED WHEN NECESSARY
        botCache.recentLogs.delete(message.guildID);

        if (data.ignoredRoleName && args.role) {
          await db.serverlogs.update(message.guildID, {
            [data.ignoredRoleName]: [
              ...(logs[data.ignoredRoleName] || []),
              args.role.id,
            ],
          });
        }

        if (args.channel) {
          await db.serverlogs.update(
            message.guildID,
            {
              [data.ignoredChannelName]: [
                ...(logs[data.ignoredChannelName] || []),
              ]
                .filter((id) => id !== args.channel!.id),
            },
          );
        }
      },
    });
  }
});
