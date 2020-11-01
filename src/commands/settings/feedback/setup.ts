import {
  botID,
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
import { botCache } from "../../../../cache.ts";

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
        permission_overwrites: [
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
      ideaQuestions: IDEA_QUESTIONS,
      bugsQuestions: BUGS_QUESTIONS,
    });

    const botMember = guild.members.get(botID);
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
