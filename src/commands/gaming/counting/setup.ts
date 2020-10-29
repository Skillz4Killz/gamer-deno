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

    const [everyoneChannel, teamChannelOne, teamChannelTwo] = await Promise.all(
      [
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
