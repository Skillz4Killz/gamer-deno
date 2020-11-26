import {
  addReactions,
  botID,
  ChannelTypes,
  createGuildChannel,
  createGuildRole,
  Overwrite,
  OverwriteType,
  sendMessage,
} from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../cache.ts";
import { translate } from "../../../utils/i18next.ts";
import { db } from "../../../database/database.ts";

createSubcommand("counting", {
  name: "setup",
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["ADMINISTRATOR"],
  guildOnly: true,
  execute: async function (message, args, guild) {
    if (!guild) return;

    // Create the counting category
    const [category, teamRoleOne, teamRoleTwo, losersRole] = await Promise.all([
      createGuildChannel(
        guild,
        translate(guild.id, "strings:COUNTING_CATEGORY_NAME"),
        { type: ChannelTypes.GUILD_CATEGORY },
      ),
      createGuildRole(
        guild.id,
        { name: translate(guild.id, "strings:COUNTING_TEAM_ONE_ROLE") },
      ),
      createGuildRole(
        guild.id,
        { name: translate(guild.id, "strings:COUNTING_TEAM_TWO_ROLE") },
      ),
      createGuildRole(
        guild.id,
        { name: translate(guild.id, "strings:COUNTING_LOSERS_ROLE") },
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
          translate(guild.id, "strings:COUNTING_HOW_TO_PLAY"),
          { parent_id: category.id, permissionOverwrites: baseOverwrites },
        ),
        createGuildChannel(
          guild,
          translate(guild.id, "strings:COUNTING_TEAM_SELECT"),
          {
            parent_id: category.id,
            permissionOverwrites: [{
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
          translate(guild.id, "strings:COUNTING_COUNTING_GLOBAL"),
          { parent_id: category.id, topic: "gamerCounting" },
        ),
        createGuildChannel(
          guild,
          translate(guild.id, "strings:COUNTING_TEAM_ONE"),
          {
            parent_id: category.id,
            topic: "gamerCounting",
            permissionOverwrites: [
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
          translate(guild.id, "strings:COUNTING_TEAM_TWO"),
          {
            parent_id: category.id,
            topic: "gamerCounting",
            permissionOverwrites: [
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

    // Send the how to play instructions
    await sendMessage(
      howToPlayChannel.id,
      [
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_1"),
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_2"),
        translate(
          message.guildID,
          "strings:COUNTING_HOW_TO_PLAY_3",
          {
            channel: everyoneChannel.mention,
            one: teamChannelOne.mention,
            two: teamChannelTwo.mention,
          },
        ),
        translate(
          message.guildID,
          "strings:COUNTING_HOW_TO_PLAY_4",
          { one: teamChannelOne.mention, two: teamChannelTwo.mention },
        ),
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_5"),
      ].join("\n"),
    );

    await sendMessage(
      howToPlayChannel.id,
      [
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_6"),
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_7"),
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_8"),
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_9"),
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_10"),
      ].join("\n"),
    );

    await sendMessage(
      howToPlayChannel.id,
      [
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_11"),
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_12"),
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_13"),
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_14"),
        translate(message.guildID, "strings:COUNTING_HOW_TO_PLAY_15"),
      ].join("\n"),
    );

    sendMessage(
      howToPlayChannel.id,
      [
        translate(message.guildID, "strings:NEED_SUPPORT"),
        botCache.constants.botSupportInvite,
      ].join("\n"),
    );

    // Send the select team instructions
    const pickTeamMessage = await sendMessage(
      teamSelectChannel.id,
      translate(
        message.guildID,
        "strings:COUNTING_PICK_YOUR_TEAM",
        { returnObjects: true },
      ).join("\n"),
    );
    addReactions(teamSelectChannel.id, pickTeamMessage.id, ["👤", "🤖"]);

    // TODO: Create reaction role to select a team

    // Create unique roleset to make sure they can only be in 1 team and that removes the team role when the tutor role is added.
    db.uniquerolesets.update(message.id, {
      guildID: message.guildID,
      name: "counting",
      roleIDs: [teamRoleOne.id, teamRoleTwo.id, losersRole.id],
    });

    db.counting.update(teamChannelOne.id, {
      guildID: guild.id,
      channelID: teamChannelOne.id,
      loserRoleID: losersRole.id,
      localOnly: true,
      deleteInvalid: botCache.vipGuildIDs.has(guild.id),
      count: 0,
      buffs: [],
      debuffs: [],
    });

    db.counting.update(teamChannelTwo.id, {
      guildID: guild.id,
      channelID: teamChannelTwo.id,
      loserRoleID: losersRole.id,
      localOnly: true,
      deleteInvalid: botCache.vipGuildIDs.has(guild.id),
      count: 0,
      buffs: [],
      debuffs: [],
    });

    db.counting.update(everyoneChannel.id, {
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
