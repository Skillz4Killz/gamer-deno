import {
  addReactions,
  botHasChannelPermissions,
  cache,
  ChannelTypes,
  deleteMessage,
  memberIDHasPermission,
  Permissions,
  sendDirectMessage,
  sendMessage,
} from "../../deps.ts";
import { botCache } from "../../cache.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";

const feedbackEmojis = [
  botCache.constants.emojis.voteup,
  botCache.constants.emojis.votedown,
  botCache.constants.emojis.mailbox,
  botCache.constants.emojis.success,
  botCache.constants.emojis.failure,
];

botCache.helpers.sendFeedback = async function (
  message,
  channel,
  embed,
  settings,
  isBugReport = false,
) {
  const channelToUse = cache.channels.get(settings.approvalChannelID) ||
    channel;
  if (
    !channelToUse ||
    ![ChannelTypes.GUILD_TEXT, ChannelTypes.GUILD_NEWS].includes(
      channelToUse.type,
    )
  ) {
    return;
  }

  const needsApproval = channel.id === channelToUse.id;

  const feedback = await sendEmbed(channelToUse.id, embed);
  if (!feedback) return;

  // Create all reactions and then react to the message sent in the feedback channel
  // Permissions are checked in the bug command so we should be good to react
  const emojis = needsApproval
    ? feedbackEmojis
    : [botCache.constants.emojis.success, botCache.constants.emojis.failure];
  addReactions(channelToUse.id, feedback.id, emojis, true);

  // Increment by 1
  botCache.stats.feedbacksSent += 1;

  // Add the feedback to the database for use in the reaction system
  db.feedbacks.create(feedback.id, {
    feedbackID: feedback.id,
    userID: message.author.id,
    guildID: channel.guildID,
    isBugReport,
  });

  sendEmbed(settings.feedbackLogChannelID, embed);
};

botCache.helpers.removeFeedbackReaction = async function (
  message,
  emoji,
  userID,
) {
  if (!message.embeds.length) return;
  const fullEmojiName = `<${
    emoji.animated ? "a" : ""
  }:${emoji.name}:${emoji.id}>`;

  // Check if this message is a feedback message
  const feedback = await db.feedbacks.get(message.id);
  if (!feedback) return;

  const channel = cache.channels.get(message.channelID);
  if (!channel) return;

  // Fetch the guild settings for this guild
  const settings = await db.guilds.get(channel.guildID);
  if (!settings) return;

  // Check if valid feedback channel
  if (
    ![settings.ideaChannelID, settings.bugsChannelID].includes(
      message.channelID,
    )
  ) {
    return;
  }

  // Check if a valid emoji was used
  if (
    ![botCache.constants.emojis.voteup, botCache.constants.emojis.votedown]
      .includes(fullEmojiName)
  ) {
    return;
  }

  const member = await botCache.helpers.fetchMember(
    channel.guildID,
    feedback.userID,
  );
  if (!member) return;

  // TODO: fix xp
  // if (fullEmojiName === botCache.constants.emojis.voteup) return Gamer.helpers.levels.removeXP(member, 3)
  // if (fullEmojiName === botCache.constants.emojis.votedown) return Gamer.helpers.levels.addLocalXP(member, 3, true)
};

botCache.helpers.handleFeedbackReaction = async function (
  message,
  emoji,
  userID,
) {
  if (!message.embeds.length) return;

  const fullEmojiName = `<${
    emoji.animated ? "a" : ""
  }:${emoji.name}:${emoji.id}>`;
  // Check if a valid emoji was used
  if (!feedbackEmojis.includes(fullEmojiName)) return;

  const channel = cache.channels.get(message.channelID);
  if (!channel) return;

  // Check if this message is a feedback message
  const [feedback, settings] = await Promise.all(
    [db.feedbacks.get(message.id), db.guilds.get(channel.guildID)],
  );
  if (!feedback || !settings) return;

  // Check if valid feedback channel
  if (
    ![
      settings.ideaChannelID,
      settings.bugsChannelID,
      settings.approvalChannelID,
    ].includes(message.channelID)
  ) {
    return;
  }

  const reactorMember = await botCache.helpers.fetchMember(
    channel.guildID,
    userID,
  );
  if (!reactorMember) return;

  const reactorIsMod = reactorMember.roles.some((id) =>
    settings.modRoleIDs.includes(id)
  );
  const reactorIsAdmin = reactorMember.roles.includes(settings.adminRoleID) ||
    await memberIDHasPermission(userID, channel.guildID, ["ADMINISTRATOR"]);
  const feedbackMember = await botCache.helpers.fetchMember(
    channel.guildID,
    feedback.userID,
  );

  switch (fullEmojiName) {
    // This case will run if the reaction was the Mailbox reaction
    case botCache.constants.emojis.mailbox:
      // If the user is not atleast a mod cancel everything
      if (!reactorIsAdmin && !reactorIsMod) return;
      // Make sure the member is in the guild
      if (!feedbackMember) return;
      // Server has not enabled mails
      if (!settings.mailsEnabled || !settings.mailCategoryID) return;

      db.mails.findOne({
        guildID: channel.guildID,
        userID: feedback.userID,
      })
        .then((openMail) => {
          if (!openMail) {
            // Create a mail for this guild. Passing the User will override message.author in mailCreate
            return botCache.helpers.mailCreate(
              message,
              `Feedback details requested by ${reactorMember.tag}`,
              feedbackMember,
            );
          }

          // They have an open mail so we can just send it there
          return sendMessage(openMail.channelID, { embed: message.embeds[0] });
        });
      break;
    // This case will run if the reaction was the solved green check mark
    case botCache.constants.emojis.success:
      // If the user is not atleast a mod cancel everything
      if (!reactorIsAdmin && !reactorIsMod) return;

      // If this is the approval channel we need to move the feedback to the new channel
      if (message.channelID === settings.approvalChannelID) {
        const embed = new Embed(message.embeds[0]);

        const channelID = feedback.isBugReport
          ? settings.bugsChannelID
          : settings.ideaChannelID;

        if (
          !botHasChannelPermissions(
            channelID,
            [
              Permissions.VIEW_CHANNEL,
              Permissions.SEND_MESSAGES,
              Permissions.EMBED_LINKS,
              Permissions.ADD_REACTIONS,
              Permissions.USE_EXTERNAL_EMOJIS,
              Permissions.READ_MESSAGE_HISTORY,
            ],
          )
        ) {
          return;
        }

        const approvedFeedback = await sendEmbed(channelID, embed);
        if (!approvedFeedback) return;

        addReactions(channelID, approvedFeedback.id, feedbackEmojis, true);

        db.feedbacks.delete(feedback.id);
        db.feedbacks.create(approvedFeedback.id, {
          ...feedback,
          id: approvedFeedback.id,
        });
        return deleteMessage(message).catch(() => undefined);
      }

      if (feedbackMember) {
        // TODO: fix
        // Gamer.helpers.levels.addLocalXP(feedbackMember, 50, true);
        try {
          await sendDirectMessage(feedbackMember.id, settings.solvedMessage);
          // Shows the user the feedback that was accepted
          await sendDirectMessage(
            feedbackMember.id,
            { embed: message.embeds[0] },
          );
        } catch {}
      }

      // Send the feedback to the solved channel
      sendMessage(settings.solvedChannelID, { embed: message.embeds[0] }).catch(
        () => undefined,
      );

      // Deletes the feedback
      return deleteMessage(message).catch(() => undefined);
    // This case will run when the red x is reacted on
    case botCache.constants.emojis.failure:
      // If the user is not atleast a mod cancel everything
      if (!reactorIsAdmin && !reactorIsMod) return;

      if (feedbackMember) {
        // TODO: fix
        // Gamer.helpers.levels.removeLocalXP(feedbackMember, 50, true);
        try {
          await sendDirectMessage(feedbackMember.id, settings.rejectedMessage);
          // Shows the user the feedback that was accepted
          await sendDirectMessage(
            feedbackMember.id,
            { embed: message.embeds[0] },
          );
        } catch {}
      }

      sendMessage(settings.rejectedChannelID, { embed: message.embeds[0] })
        .catch(() => undefined);
      // Deletes the feedback
      return deleteMessage(message).catch(() => undefined);
    // This case will run for when users react with anything else to it
    default:
      // If the user is no longer in the server we dont need to grant any xp
      if (!feedbackMember) return;

      if (fullEmojiName === botCache.constants.emojis.votedown) {
        // TODO: fix
        // Gamer.helpers.levels.completeMission(
        //   reactorMember,
        //   `votefeedback`,
        //   reactorMember.guild.id,
        // );
        // return Gamer.helpers.levels.removeXP(feedbackMember, 3);
      } else if (fullEmojiName === botCache.constants.emojis.voteup) {
        // Gamer.helpers.levels.completeMission(
        //   reactorMember,
        //   `votefeedback`,
        //   reactorMember.guild.id,
        // );
        // return Gamer.helpers.levels.addLocalXP(feedbackMember, 3, true);
      }
  }
};
