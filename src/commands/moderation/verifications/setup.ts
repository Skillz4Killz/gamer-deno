import {
  botCache,
  botID,
  cache,
  calculatePermissions,
  ChannelTypes,
  createGuildChannel,
  createGuildRole,
  editChannel,
  isChannelSynced,
  Overwrite,
  OverwriteType,
} from "../../../../deps.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";
import { db } from "../../../database/database.ts";
import { configs } from "../../../../configs.ts";
import { Embed } from "../../../utils/Embed.ts";

createSubcommand("verify", {
  name: "setup",
  arguments: [
    { name: "guildID", type: "snowflake", required: false },
  ],
  botServerPermissions: ["ADMINISTRATOR"],
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async function (message, args, guild) {
    if (!guild) return botCache.helpers.reactError(message);

    const REASON = translate(message.guildID, `strings:VERIFY_SETUP_REASON`);

    const settings = await db.guilds.get(message.guildID);

    const overwrites: Overwrite[] = [
      {
        id: botID,
        type: OverwriteType.MEMBER,
        allow: [
          "VIEW_CHANNEL",
          "SEND_MESSAGES",
          "EMBED_LINKS",
          "ADD_REACTIONS",
          "USE_EXTERNAL_EMOJIS",
          "MANAGE_MESSAGES",
          "READ_MESSAGE_HISTORY",
        ],
        deny: [],
      },
      {
        id: message.guildID,
        type: OverwriteType.ROLE,
        allow: [],
        deny: ["VIEW_CHANNEL"],
      },
    ];

    if (settings?.adminRoleID) {
      overwrites.push(
        {
          id: settings.adminRoleID,
          allow: ["VIEW_CHANNEL"],
          deny: [],
          type: OverwriteType.ROLE,
        },
      );
    }
    for (const id of settings?.modRoleIDs || []) {
      overwrites.push(
        { id, allow: ["VIEW_CHANNEL"], deny: [], type: OverwriteType.ROLE },
      );
    }

    const category = await createGuildChannel(
      guild,
      translate(message.guildID, `strings:VERIFY_CATEGORY_NAME`),
      {
        type: ChannelTypes.GUILD_CATEGORY,
        permissionOverwrites: overwrites,
      },
    );

    // Create the verify role
    const role = await createGuildRole(
      message.guildID,
      { name: translate(message.guildID, "strings:VERIFY_ROLE_NAME") },
    );
    // Create the channel inside the category so it has the proper permissions
    const verifyChannel = await createGuildChannel(
      guild,
      translate(message.guildID, "strings:VERIFY_CHANNEL_NAME", {
        reason: REASON,
        parentID: category.id,
      }),
    );

    editChannel(
      verifyChannel.id,
      {
        overwrites: [
          ...(verifyChannel.permissionOverwrites || []).map((o) => ({
            id: o.id,
            type: o.type,
            allow: calculatePermissions(BigInt(o.allow)),
            deny: calculatePermissions(BigInt(o.deny)),
          })),
          {
            id: role.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            deny: [],
            type: OverwriteType.ROLE,
          },
        ],
      },
    );

    db.guilds.update(
      message.guildID,
      {
        verifyCategoryID: category.id,
        verifyEnabled: true,
        verifyRoleID: role.id,
        firstMessageJSON: JSON.stringify({
          description: [
            translate(message.guildID, "strings:VERIFY_SETUP_THANKS"),
            ``,
            translate(message.guildID, "strings:VERIFY_SETUP_UNLOCK"),
            `**${settings?.prefix || configs.prefix}verify end**`,
          ].join("\n"),
          author: {
            name: translate(message.guildID, "strings:VERIFY_SETUP_AMAZING"),
            icon_url: "https://i.imgur.com/0LxU5Yy.jpg",
          },
          image: "https://i.imgur.com/oN4YjaY.gif",
        }),
      },
    );

    // Edit all necessary channels with the verify role to prevent users from seeing any channels except the verify channel
    cache.channels.forEach(async (channel) => {
      if (channel.guildID !== message.guildID) return;

      if (channel.parentID === category.id || channel.id === category.id) {
        return;
      }

      if (await isChannelSynced(channel.id)) return;

      // Update the channel perms
      editChannel(
        verifyChannel.id,
        {
          overwrites: [
            ...(verifyChannel.permissionOverwrites || []).map((o) => ({
              id: o.id,
              type: o.type,
              allow: calculatePermissions(BigInt(o.allow)),
              deny: calculatePermissions(BigInt(o.deny)),
            })),
            {
              id: role.id,
              allow: [],
              deny: ["VIEW_CHANNEL"],
              type: OverwriteType.ROLE,
            },
          ],
        },
      );
    });

    const embed = new Embed()
      .setDescription(
        [
          translate(message.guildID, "strings:VERIFY_SETUP_THRILLED"),
          ``,
          `**${settings?.prefix || configs.prefix}verify**`,
        ].join("\n"),
      )
      .setAuthor(
        translate(message.guildID, "strings:VERIFY_SETUP_WELCOME"),
        `https://i.imgur.com/0LxU5Yy.jpg`,
      )
      .setTitle(translate(message.guildID, "strings:VERIFY_SETUP_PROCESS"))
      .setFooter(translate(message.guildID, "strings:VERIFY_SETUP_HELP"));

    sendEmbed(verifyChannel.id, embed);
  },
});
