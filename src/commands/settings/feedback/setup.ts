import {
  botCache,
  botID,
  cache,
  ChannelTypes,
  createGuildChannel,
  OverwriteType,
} from "../../../../deps.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import {
  createSubcommand,
  sendEmbed,
  sendResponse,
} from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";
import { db } from "../../../database/database.ts";
import { Embed } from "../../../utils/Embed.ts";

createSubcommand("settings-feedback", {
  name: "setup",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  execute: async (
    message,
    args: SettingsFeedbackRejectedmessageArgs,
    guild,
  ) => {
    if (!guild) return;

    sendResponse(
      message,
      translate(message.guildID, "commands/feedback:PATIENCE"),
    );

    // Create the category first and edit its permissions so that the other two channels can be syned easily
    const category = await createGuildChannel(
      guild,
      translate(guild.id, `commands/feedback:CATEGORY_NAME`),
      {
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
      },
    );

    const [ideaChannel, bugsChannel] = await Promise.all([
      createGuildChannel(
        guild,
        translate(guild.id, "commands/feedback:IDEA_CHANNEL_NAME"),
        { parent_id: category.id },
      ),
      createGuildChannel(
        guild,
        translate(guild.id, "commands/feedback:BUGS_CHANNEL_NAME"),
        { parent_id: category.id },
      ),
    ]);

    const IDEA_QUESTIONS = translate(
      guild.id,
      "commands/feedback:IDEA_QUESTIONS_DEFAULT",
      { returnObjects: true },
    );
    const BUGS_QUESTIONS = translate(
      guild.id,
      "commands/feedback:BUGS_QUESTIONS_DEFAULT",
      { returnObjects: true },
    );

    db.guilds.update(guild.id, {
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
          options: [
            translate(guild.id, "strings:MULTIPLAYER"),
            translate(guild.id, "strings:BATTLE_ROYALE"),
          ],
        },
        {
          text: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_5_TEXT"),
          name: translate(guild.id, "strings:FEEDBACK_BUGS_QUESTION_5_NAME"),
          type: "reaction",
          options: [
            translate(guild.id, "strings:FACEBOOK"),
            translate(guild.id, "strings:GUEST"),
          ],
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
      ],
    });

    const botMember = cache.members.get(botID);
    const gamertag = botMember?.tag || `username#XXXX`;

    const embed = new Embed()
      .setAuthor(
        translate(guild.id, `commands/feedback:IDEA_FROM`, { user: gamertag }),
        botMember?.avatarURL,
      )
      .setThumbnail(botMember?.avatarURL || "")
      .addField(
        IDEA_QUESTIONS[0],
        translate(guild.id, `commands/feedback:IDEA_ANSWER_1`),
      )
      .addField(
        IDEA_QUESTIONS[1],
        translate(guild.id, `commands/feedback:IDEA_ANSWER_2`),
      )
      .setImage("https://i.imgur.com/2L9ePkb.png")
      .setTimestamp();

    const bugsEmbed = new Embed()
      .setAuthor(
        translate(guild.id, `commands/feedback:BUGS_FROM`, { user: gamertag }),
        botMember?.avatarURL,
      )
      .setColor(`#F44A41`)
      .setThumbnail(botMember?.avatarURL || "")
      .addField(
        BUGS_QUESTIONS[1],
        translate(guild.id, `commands/feedback:BUGS_ANSWER_1`),
      )
      .addField(
        BUGS_QUESTIONS[2],
        translate(guild.id, `commands/feedback:BUGS_ANSWER_2`),
      )
      .setImage(`https://i.imgur.com/lQr66JV.png`)
      .setTimestamp();

    // Send example idea
    sendEmbed(ideaChannel.id, embed);
    // Send example bug
    sendEmbed(bugsChannel.id, bugsEmbed);

    return botCache.helpers.reactSuccess(message);
  },
});

interface SettingsFeedbackRejectedmessageArgs {
  text: string;
}
