import {
  addReactions,
  botCache,
  createGuildRole,
  guildIconURL,
} from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

const reactionRoleData = [
  { name: "red", hex: "#ff0000", emoji: botCache.constants.emojis.colors.red },
  {
    name: "purplered",
    hex: "#33032b",
    emoji: botCache.constants.emojis.colors.purplered,
  },
  {
    name: "purple",
    hex: "#4b0082",
    emoji: botCache.constants.emojis.colors.purple,
  },
  {
    name: "pinkpurple",
    hex: "#c000ff",
    emoji: botCache.constants.emojis.colors.pinkpurple,
  },
  {
    name: "pink",
    hex: "#ff5f9a",
    emoji: botCache.constants.emojis.colors.pink,
  },
  {
    name: "pastelyellow",
    hex: "#fffad1",
    emoji: botCache.constants.emojis.colors.pastelyellow,
  },
  {
    name: "pastelred",
    hex: "#ff876c",
    emoji: botCache.constants.emojis.colors.pastelred,
  },
  {
    name: "pastelpurple",
    hex: "#dac2dc",
    emoji: botCache.constants.emojis.colors.pastelpurple,
  },
  {
    name: "pastelpink",
    hex: "#fbccd3",
    emoji: botCache.constants.emojis.colors.pastelpink,
  },
  {
    name: "pastelorange",
    hex: "#f7af4b",
    emoji: botCache.constants.emojis.colors.pastelorange,
  },
  {
    name: "pastelgreen",
    hex: "#bdecb6",
    emoji: botCache.constants.emojis.colors.pastelgreen,
  },
  {
    name: "pastelblue",
    hex: "#c8dcf4",
    emoji: botCache.constants.emojis.colors.pastelblue,
  },
  {
    name: "orange",
    hex: "#fe6019",
    emoji: botCache.constants.emojis.colors.orange,
  },
  {
    name: "limegreen",
    hex: "#65ff00",
    emoji: botCache.constants.emojis.colors.limegreen,
  },
  {
    name: "lightorange",
    hex: "#ff9a00",
    emoji: botCache.constants.emojis.colors.lightorange,
  },
  {
    name: "lightblue",
    hex: "#4fadab",
    emoji: botCache.constants.emojis.colors.lightblue,
  },
  {
    name: "brown",
    hex: "#4f3205",
    emoji: botCache.constants.emojis.colors.brown,
  },
  {
    name: "brightyellow",
    hex: "#ffff00",
    emoji: botCache.constants.emojis.colors.brightyellow,
  },
  {
    name: "brightpink",
    hex: "#ff0078",
    emoji: botCache.constants.emojis.colors.brightpink,
  },
  {
    name: "blue",
    hex: "#223480",
    emoji: botCache.constants.emojis.colors.blue,
  },
];

createSubcommand("roles-reactions", {
  name: "setup",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
  guildOnly: true,
  vipServerOnly: true,
  botChannelPermissions: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "EMBED_LINKS",
    "USE_EXTERNAL_EMOJIS",
    "READ_MESSAGE_HISTORY",
    "ADD_REACTIONS",
  ],
  execute: async function (message, _args, guild) {
    if (!guild?.roles.size || guild.roles.size + 20 > 250) {
      return botCache.helpers.reactError(message);
    }

    const reactionRole = await db.reactionroles.findOne({
      name: "colors",
      guildID: message.guildID,
    });

    if (reactionRole) return botCache.helpers.reactError(message);

    const exists = await db.uniquerolesets.findOne({
      name: "colors",
      guildID: message.guildID,
    });
    if (exists) return botCache.helpers.reactError(message);

    // Create all 20 roles

    const roles = await Promise.all(
      reactionRoleData.map((data) =>
        createGuildRole(
          message.guildID,
          { name: data.name, color: parseInt(data.hex.replace("#", ""), 16) },
        )
      ),
    );

    // Send a message
    const embed = new Embed()
      .setAuthor(
        translate(message.guildID, "strings:RR_COLORS_COLOR_WHEEL"),
        "https://i.imgur.com/wIrhA5A.jpg",
      )
      .setDescription(
        translate(message.guildID, "strings:RR_COLORS_PICK_COLOR"),
      )
      .addField(
        translate(message.guildID, "strings:RR_COLORS_DONT_FORGET"),
        translate(message.guildID, "strings:RR_COLORS_ONLY_ONE"),
      )
      .setFooter(
        translate(message.guildID, "strings:RR_COLORS_CUSTOMIZE_PICKER"),
        guildIconURL(guild),
      );
    const baseMessage = await sendEmbed(message.channelID, embed);
    if (!baseMessage) return botCache.helpers.reactError(message);

    // Create reaction role
    db.reactionroles.create(message.id, {
      name: "colors",
      reactions: roles.map((role, index) => ({
        reaction: botCache.helpers.emojiReaction(
          reactionRoleData[index]!.emoji,
        ),
        roleIDs: [role.id],
      })),
      messageID: baseMessage.id,
      channelID: baseMessage.channelID,
      guildID: message.guildID,
      authorID: message.author.id,
    });

    // Create a roleset
    db.uniquerolesets.create(message.id, {
      name: "colors",
      roleIDs: roles.map((role) => role.id),
      guildID: message.guildID,
    });

    // Create all 20 reactions
    addReactions(
      message.channelID,
      baseMessage.id,
      reactionRoleData.map((d) => d.emoji),
    );
  },
});
