import { botCache, botID, ChannelTypes, createGuildChannel, OverwriteType, sendMessage } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { parsePrefix } from "../../../monitors/commandHandler.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("settings-feedback", {
  name: "setup",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  execute: async (message, args, guild) => {
    if (!guild) return;

    // Create the category first and edit its permissions so that the other two channels can be syned easily
    const category = await createGuildChannel(guild, translate(guild.id, `strings:FEEDBACK_CATEGORY_NAME`), {
      type: ChannelTypes.GUILD_CATEGORY,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: [],
          deny: ["SEND_MESSAGES", "ADD_REACTIONS"],
          type: OverwriteType.ROLE,
        },
        {
          id: botID,
          allow: [
            "VIEW_CHANNEL",
            "SEND_MESSAGES",
            "EMBED_LINKS",
            "ADD_REACTIONS",
            "USE_EXTERNAL_EMOJIS",
            "ATTACH_FILES",
            "READ_MESSAGE_HISTORY",
          ],
          deny: [],
          type: OverwriteType.MEMBER,
        },
      ],
    });

    const [ideaChannel, bugsChannel] = await Promise.all([
      createGuildChannel(guild, translate(guild.id, "strings:IDEA_CHANNEL_NAME"), { parent_id: category.id }),
      createGuildChannel(guild, translate(guild.id, "strings:BUGS_CHANNEL_NAME"), { parent_id: category.id }),
    ]);

    await db.guilds.update(guild.id, {
      ideaChannelID: ideaChannel.id,
      bugsChannelID: bugsChannel.id,
      ideaQuestions: [
        {
          text: translate(guild.id, "strings:FEEDBACK_IDEA_QUESTION_1_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_IDEA_QUESTION_1_NAME"),
          type: "reaction",
          options: [
            translate(guild.id, "strings:ADD_FEATURE"),
            translate(guild.id, "strings:REMOVE_FEATURE"),
            translate(guild.id, "strings:COMPLAINT"),
            translate(guild.id, "strings:GENERAL"),
            translate(guild.id, "strings:TWEAKS"),
          ],
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_IDEA_QUESTION_2_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_IDEA_QUESTION_2_NAME"),
          type: "message",
          subtype: "...string",
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_IDEA_QUESTION_3_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_IDEA_QUESTION_3_NAME"),
          type: "message",
          subtype: "...string",
        },
      ],
      bugsQuestions: [
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_1_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_1_NAME"),
          type: "message",
          subtype: "...string",
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_2_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_2_NAME"),
          type: "message",
          subtype: "...string",
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_3_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_3_NAME"),
          type: "message",
          subtype: "...string",
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_4_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_4_NAME"),
          type: "reaction",
          options: [translate(guild.id, "strings:MULTIPLAYER"), translate(guild.id, "strings:BATTLE_ROYALE")],
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_5_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_5_NAME"),
          type: "reaction",
          options: [translate(guild.id, "strings:FACEBOOK"), translate(guild.id, "strings:GUEST")],
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_5_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_5_NAME"),
          type: "message",
          subtype: "...string",
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_6_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_6_NAME"),
          type: "message",
          subtype: "number",
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_7_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_7_NAME"),
          type: "message",
          subtype: "...string",
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_8_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_8_NAME"),
          type: "message",
          subtype: "...string",
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_9_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_9_NAME"),
          type: "message",
          subtype: "...string",
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_10_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_10_NAME"),
          type: "message",
          subtype: "...string",
        },
      ],
    });

    await sendMessage(ideaChannel.id, `**${parsePrefix(message.guildID)}idea**`).catch(console.log);
    await sendMessage(bugsChannel.id, `**${parsePrefix(message.guildID)}bugs**`).catch(console.log);

    return botCache.helpers.reactSuccess(message);
  },
});
