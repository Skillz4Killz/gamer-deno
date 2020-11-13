import type { Overwrite } from "../../../../deps.ts";

import {
  botID,
  ChannelTypes,
  createGuildChannel,
  createGuildRole,
  OverwriteType,
} from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../cache.ts";
import { translate } from "../../../utils/i18next.ts";
import { db } from "../../../database/database.ts";
import { baseEndpoints } from "https://wosb3ijcebvjpb3s2aa5x6cy6s57omgxzicuqq3uzanpnp2zxr6q.arweave.net/s6QdoSIgapeHctAB2_hY9Lv3MNfKBUhDdMga9r9ZvH0/src/constants/discord.ts";

createSubcommand("counting", {
  name: "setup",
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["MANAGE_CHANNELS", "MANAGE_ROLES"],
  guildOnly: true,
  execute: async function (message, args, guild) {
    if (!guild) return;

    // Create the counting category
    const [category, teamRoleOne, teamRoleTwo, losersRole] = await Promise.all([
      createGuildChannel(
        guild,
        translate(guild.id, "commands/counting:CATEGORY_NAME"),
        { type: ChannelTypes.GUILD_CATEGORY },
      ),
      createGuildRole(
        guild.id,
        { name: translate(guild.id, "commands/counting:TEAM_ONE_ROLE") },
      ),
      createGuildRole(
        guild.id,
        { name: translate(guild.id, "commands/counting:TEAM_TWO_ROLE") },
      ),
      createGuildRole(
        guild.id,
        { name: translate(guild.id, "commands/counting:LOSERS_ROLE") },
      ),
    ]);

    const baseOverwrites: Overwrite[] = [
      {
        id: botID,
        allow: [
          "VIEW_CHANNEL",
          "SEND_MESSAGES",
          "USE_EXTERNAL_EMOJIS",
          "ADD_REACTIONS",
          "READ_MESSAGE_HISTORY",
        ],
        deny: [],
        type: OverwriteType.MEMBER,
      },
      {
        id: guild.id,
        allow: ["VIEW_CHANNEL"],
        deny: ["SEND_MESSAGES"],
        type: OverwriteType.ROLE,
      },
    ];

    const [
      howToPlayChannel,
      teamSelectChannel,
      everyoneChannel,
      teamChannelOne,
      teamChannelTwo,
    ] = await Promise.all(
      [
        createGuildChannel(
          guild,
          translate(guild.id, "commands/counting:HOW_TO_PLAY"),
          { parent_id: category.id, permission_overwrites: baseOverwrites },
        ),
        createGuildChannel(
          guild,
          translate(guild.id, "commands/counting:TEAM_SELECT"),
          {
            parent_id: category.id,
            permission_overwrites: [{
              id: botID,
              allow: [
                "VIEW_CHANNEL",
                "SEND_MESSAGES",
                "USE_EXTERNAL_EMOJIS",
                "ADD_REACTIONS",
                "READ_MESSAGE_HISTORY",
              ],
              deny: [],
              type: OverwriteType.MEMBER,
            }, {
              id: teamRoleOne.id,
              type: OverwriteType.ROLE,
              allow: [],
              deny: ["VIEW_CHANNEL"],
            }, {
              id: teamRoleTwo.id,
              type: OverwriteType.ROLE,
              allow: [],
              deny: ["VIEW_CHANNEL"],
            }],
          },
        ),
        createGuildChannel(
          guild,
          translate(guild.id, "commands/counting:COUNTING_GLOBAL"),
          { parent_id: category.id, topic: "gamerCounting" },
        ),
        createGuildChannel(
          guild,
          translate(guild.id, "commands/counting:TEAM_ONE"),
          {
            parent_id: category.id,
            topic: "gamerCounting",
            permission_overwrites: [
              ...baseOverwrites,
              {
                id: teamRoleOne.id,
                allow: [
                  "VIEW_CHANNEL",
                  "SEND_MESSAGES",
                ],
                deny: [],
                type: OverwriteType.ROLE,
              },
            ],
          },
        ),
        createGuildChannel(
          guild,
          translate(guild.id, "commands/counting:TEAM_TWO"),
          {
            parent_id: category.id,
            topic: "gamerCounting",
            permission_overwrites: [
              ...baseOverwrites,
              {
                id: teamRoleTwo.id,
                allow: [
                  "VIEW_CHANNEL",
                  "SEND_MESSAGES",
                ],
                deny: [],
                type: OverwriteType.ROLE,
              },
            ],
          },
        ),
      ],
    );

    // TODO: finish this part
    // Send the how to play instructions

    // Send the select team instructions

    // Create reaction role to select a team

    // Create unique roleset to make sure they can only be in 1 team.

    // Create a unique roleset that removes the team role when the tutor role is added

    db.counting.create(teamChannelOne.id, {
      guildID: guild.id,
      channelID: teamChannelOne.id,
      loserRoleID: losersRole.id,
      localOnly: true,
      deleteInvalid: botCache.vipGuildIDs.has(guild.id),
      count: 0,
      buffs: [],
      debuffs: [],
    });

    db.counting.create(teamChannelTwo.id, {
      guildID: guild.id,
      channelID: teamChannelTwo.id,
      loserRoleID: losersRole.id,
      localOnly: true,
      deleteInvalid: botCache.vipGuildIDs.has(guild.id),
      count: 0,
      buffs: [],
      debuffs: [],
    });

    db.counting.create(everyoneChannel.id, {
      guildID: guild.id,
      channelID: everyoneChannel.id,
      loserRoleID: losersRole.id,
      localOnly: false,
      deleteInvalid: botCache.vipGuildIDs.has(guild.id),
      count: 0,
      buffs: [],
      debuffs: [],
    });

    botCache.helpers.reactSuccess(message);
  },
});
