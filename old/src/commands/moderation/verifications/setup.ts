import { configs } from "../../../../configs.ts";
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
  editChannelOverwrite,
} from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("verify", {
  name: "setup",
  arguments: [{ name: "guildID", type: "snowflake", required: false }],
  botServerPermissions: ["ADMINISTRATOR"],
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async function (message, _args, guild) {
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
      overwrites.push({
        id: settings.adminRoleID,
        allow: ["VIEW_CHANNEL"],
        deny: [],
        type: OverwriteType.ROLE,
      });
    }
    for (const id of settings?.modRoleIDs || []) {
      overwrites.push({
        id,
        allow: ["VIEW_CHANNEL"],
        deny: [],
        type: OverwriteType.ROLE,
      });
    }

    const category = await createGuildChannel(guild, translate(message.guildID, `strings:VERIFY_CATEGORY_NAME`), {
      type: ChannelTypes.GUILD_CATEGORY,
      permissionOverwrites: overwrites,
    });

    // Create the verify role
    const [role, playersRole, botsRole] = await Promise.all([
      createGuildRole(message.guildID, {
        name: translate(message.guildID, "strings:VERIFY_ROLE_NAME"),
      }),
      createGuildRole(message.guildID, {
        name: translate(message.guildID, "strings:PLAYERS_ROLE_NAME"),
      }),
      createGuildRole(message.guildID, {
        name: translate(message.guildID, "strings:BOTS_ROLE_NAME"),
      }),
    ]);

    // Create the channel inside the category so it has the proper permissions
    const verifyChannel = await createGuildChannel(
      guild,
      translate(message.guildID, "strings:VERIFY_CHANNEL_NAME", {
        reason: REASON,
        parentID: category.id,
      }),
      {
        permissionOverwrites: [
          {
            id: guild.id,
            type: OverwriteType.ROLE,
            allow: [],
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: role.id,
            type: OverwriteType.ROLE,
            allow: ["VIEW_CHANNEL"],
            deny: [],
          },
        ],
      }
    );

    await db.guilds.update(message.guildID, {
      verifyCategoryID: category.id,
      verifyEnabled: true,
      verifyRoleID: role.id,
      userAutoRoleID: playersRole.id,
      botsAutoRoleID: botsRole.id,
      discordVerificationStrictnessEnabled: true,
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
    });

    // Edit all necessary channels with the verify role to prevent users from seeing any channels except the verify channel
    cache.channels.forEach(async (channel) => {
      if (channel.guildID !== message.guildID) return;

      if (channel.parentID === category.id || channel.id === category.id || channel.id === verifyChannel.id) return;

      if (await isChannelSynced(channel.id)) return;

      // Update the channel perms
      await editChannelOverwrite(channel.guildID, channel.id, role.id, {
        type: OverwriteType.ROLE,
        allow: [],
        deny: ["VIEW_CHANNEL"],
      }).catch(console.log);
    });

    const embed = new Embed()
      .setDescription(
        [
          translate(message.guildID, "strings:VERIFY_SETUP_THRILLED"),
          ``,
          `**${settings?.prefix || configs.prefix}verify**`,
        ].join("\n")
      )
      .setAuthor(translate(message.guildID, "strings:VERIFY_SETUP_WELCOME"), `https://i.imgur.com/0LxU5Yy.jpg`)
      .setTitle(translate(message.guildID, "strings:VERIFY_SETUP_PROCESS"))
      .setFooter(translate(message.guildID, "strings:VERIFY_SETUP_HELP"));

    return verifyChannel.send({ embed });
  },
});
