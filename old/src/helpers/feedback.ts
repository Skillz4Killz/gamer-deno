import {
  addReactions,
  botHasChannelPermissions,
  cache,
  ChannelTypes,
  deleteMessage,
  memberIDHasPermission,
  sendDirectMessage,
  sendMessage,
} from "../../deps.ts";
import { botCache } from "../../deps.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { translate } from "../utils/i18next.ts";

const feedbackEmojis = [
  botCache.constants.emojis.voteup,
  botCache.constants.emojis.votedown,
  botCache.constants.emojis.mailbox,
  botCache.constants.emojis.success,
  botCache.constants.emojis.failure,
];

botCache.helpers.sendFeedback = async function (message, channel, embed, settings, isBugReport = false) {
  const channelToUse = cache.channels.get(settings.approvalChannelID) || channel;
  if (!channelToUse || ![ChannelTypes.GUILD_TEXT, ChannelTypes.GUILD_NEWS].includes(channelToUse.type)) {
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
  await addReactions(channelToUse.id, feedback.id, emojis, true);

  // Increment by 1
  botCache.stats.feedbacksSent += 1;

  // Add the feedback to the database for use in the reaction system
  await db.feedbacks.create(feedback.id, {
    id: feedback.id,
    userID: message.author.id,
    guildID: channel.guildID,
    isBugReport,
  });

  await sendEmbed(settings.feedbackLogChannelID, embed);
  await message.reply(translate(message.guildID, "strings:FEEDBACK_SENT"));
};

botCache.helpers.removeFeedbackReaction = async function (message, emoji, userID) {
  if (!message.embeds.length) return;
  const fullEmojiName = `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`;

  // Check if this message is a feedback message
  const feedback = await db.feedbacks.get(message.id);
  if (!feedback) return;

  const channel = cache.channels.get(message.channelID);
  if (!channel) return;

  // Fetch the guild settings for this guild
  const settings = await db.guilds.get(channel.guildID);
  if (!settings) return;

  // Check if valid feedback channel
  if (![settings.ideaChannelID, settings.bugsChannelID].includes(message.channelID)) {
    return;
  }

  // Check if a valid emoji was used
  if (![botCache.constants.emojis.voteup, botCache.constants.emojis.votedown].includes(fullEmojiName)) {
    return;
  }

  const member = await botCache.helpers.fetchMember(channel.guildID, feedback.userID);
  if (!member) return;

  if (fullEmojiName === botCache.constants.emojis.voteup) {
    return botCache.helpers.removeXP(channel.guildID, member.id, 3);
  }
  if (fullEmojiName === botCache.constants.emojis.votedown) {
    return botCache.helpers.addLocalXP(channel.guildID, member.id, 3, true);
  }
};

botCache.helpers.handleFeedbackReaction = async function (message, emoji, userID) {
  if (!message.embeds.length) return;

  const fullEmojiName = `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`;
  // Check if a valid emoji was used
  if (!feedbackEmojis.includes(fullEmojiName)) return;

  const channel = cache.channels.get(message.channelID);
  if (!channel) return;

  // Check if this message is a feedback message
  const [feedback, settings] = await Promise.all([db.feedbacks.get(message.id), db.guilds.get(channel.guildID)]);
  if (!feedback || !settings) return;

  // Check if valid feedback channel
  if (![settings.ideaChannelID, settings.bugsChannelID, settings.approvalChannelID].includes(message.channelID)) {
    return;
  }

  const reactorMember = await botCache.helpers.fetchMember(channel.guildID, userID);
  if (!reactorMember) return;

  const reactor = reactorMember.guilds.get(channel.guildID);
  if (!reactor) return;

  const reactorIsMod = reactor.roles.some((id) => settings.modRoleIDs.includes(id));
  const reactorIsAdmin =
    reactor.roles.includes(settings.adminRoleID) ||
    (await memberIDHasPermission(userID, channel.guildID, ["ADMINISTRATOR"]));
  const feedbackMember = await botCache.helpers.fetchMember(channel.guildID, feedback.userID);

  switch (fullEmojiName) {
    // This case will run if the reaction was the Mailbox reaction
    case botCache.constants.emojis.mailbox:
      // If the user is not atleast a mod cancel everything
      if (!reactorIsAdmin && !reactorIsMod) return;
      // Make sure the member is in the guild
      if (!feedbackMember) return;
      // Server has not enabled mails
      if (!settings.mailsEnabled || !settings.mailCategoryID) return;

      await db.mails
        .findOne({
          guildID: channel.guildID,
          userID: feedback.userID,
        })
        .then((openMail) => {
          if (!openMail) {
            // Create a mail for this guild. Passing the User will override message.author in mailCreate
            return botCache.helpers.mailCreate(
              message,
              `Feedback details requested by ${reactorMember.tag}`,
              feedbackMember
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

        const channelID = feedback.isBugReport ? settings.bugsChannelID : settings.ideaChannelID;

        if (
          !(await botHasChannelPermissions(channelID, [
            "VIEW_CHANNEL",
            "SEND_MESSAGES",
            "EMBED_LINKS",
            "ADD_REACTIONS",
            "USE_EXTERNAL_EMOJIS",
            "READ_MESSAGE_HISTORY",
          ]))
        ) {
          return;
        }

        if (message.attachments.length) {
          const [attachment] = message.attachments;
          if (attachment) {
            const blob = await fetch(attachment.url)
              .then((res) => res.blob())
              .catch(() => undefined);
            if (blob) embed.attachFile(blob, attachment.filename);
          }
        }

        const approvedFeedback = await sendEmbed(channelID, embed);
        if (!approvedFeedback) return;

        await addReactions(channelID, approvedFeedback.id, feedbackEmojis, true);

        await db.feedbacks.delete(feedback.id);
        await db.feedbacks.create(approvedFeedback.id, {
          ...feedback,
          id: approvedFeedback.id,
        });
        return deleteMessage(message).catch(console.log);
      }

      if (feedbackMember) {
        botCache.helpers.addLocalXP(channel.guildID, feedbackMember.id, 50, true);
        try {
          await sendDirectMessage(feedbackMember.id, settings.solvedMessage);
          // Shows the user the feedback that was accepted
          await sendDirectMessage(feedbackMember.id, {
            embed: message.embeds[0],
          });
        } catch {
          //  catch the error
        }
      }

      // Send the feedback to the solved channel
      await sendMessage(settings.solvedChannelID, {
        embed: message.embeds[0],
      }).catch(() => undefined);

      // Deletes the feedback
      return deleteMessage(message).catch(console.log);
    // This case will run when the red x is reacted on
    case botCache.constants.emojis.failure:
      // If the user is not atleast a mod cancel everything
      if (!reactorIsAdmin && !reactorIsMod) return;

      if (feedbackMember) {
        botCache.helpers.removeXP(message.guildID, feedbackMember.id, 50);
        try {
          await sendDirectMessage(feedbackMember.id, settings.rejectedMessage);
          // Shows the user the feedback that was accepted
          await sendDirectMessage(feedbackMember.id, {
            embed: message.embeds[0],
          });
        } catch {
          // cach the error
        }
      }

      const embed = new Embed(message.embeds[0]);
      if (message.attachments.length) {
        const [attachment] = message.attachments;
        if (attachment) {
          const blob = await fetch(attachment.url)
            .then((res) => res.blob())
            .catch(() => undefined);
          if (blob) embed.attachFile(blob, attachment.filename);
        }
      }

      await sendMessage(settings.rejectedChannelID, { embed }).catch(console.log);
      // Deletes the feedback
      return deleteMessage(message).catch(console.log);
    // This case will run for when users react with anything else to it
    default:
      // If the user is no longer in the server we dont need to grant any xp
      if (!feedbackMember) return;

      botCache.helpers.completeMission(channel.guildID, feedbackMember.id, `votefeedback`);

      if (fullEmojiName === botCache.constants.emojis.votedown) {
        return botCache.helpers.removeXP(channel.guildID, feedbackMember.id, 3);
      } else if (fullEmojiName === botCache.constants.emojis.voteup) {
        return botCache.helpers.addLocalXP(channel.guildID, feedbackMember.id, 3, true);
      }
  }
};
