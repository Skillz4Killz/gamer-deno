import {
  addReactions,
  botCache,
  botHasChannelPermissions,
  botHasPermission,
  cache,
  categoryChildrenIDs,
  ChannelTypes,
  createGuildChannel,
  deleteMessage,
  deleteMessageByID,
  deleteMessages,
  Message,
  sendDirectMessage,
  sendMessage,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { parsePrefix } from "../monitors/commandHandler.ts";
import { sendEmbed, sendResponse } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

export const channelNameRegex = /^-+|[^\w-]|-+$/g;

function cleanReactInDM(message: Message, type: "error" | "success" = "error") {
  if (cache.channels.has(message.author.id)) {
    if (type === "error") return botCache.helpers.reactError(message);
    return botCache.helpers.reactSuccess(message);
  }

  return sendDirectMessage(
    message.author.id,
    type === "error" ? botCache.constants.emojis.failure : botCache.constants.emojis.success
  ).catch(console.log);
}

botCache.helpers.mailHandleDM = async function (message, content) {
  const mails = await db.mails.findMany({ userID: message.author.id }, true);

  // If the user has no mails and hes trying to create a mail it needs to error because mails must be created within a guild.
  let [mail] = mails;
  if (!mail) {
    return sendDirectMessage(message.author.id, translate(message.guildID, "strings:MAIL_NEW_MAIL_IN_DM")).catch(
      console.log
    );
  }

  // A user can have multiple mails open in difference servers
  if (mails.length > 1) {
    // The first arg should be mail id if multiple mails. Ex: .mail 2 mail content here
    const [mailID] = content;
    if (mailID) {
      const id = parseInt(mailID, 10);
      if ((!id && id !== 0) || id > mails.length) {
        const mailData = mails
          .map((mail, index) => {
            const guild = cache.guilds.get(mail.mainGuildID);
            return `**[${index}]** ${guild ? guild.name : mail.mainGuildID}`;
          })
          .join("\n");
        return sendDirectMessage(
          message.author.id,
          `${translate(message.guildID, "strings:MAIL_NEED_MAIL_ID")}\n\n${mailData}`
        ).catch(console.log);
      }

      // User provided some id number
      mail = mails[id];
      // Remove the id from the content string
      content = content.substring(2);
    }
  }

  if (!mail) return cleanReactInDM(message);

  const guild = cache.guilds.get(mail.guildID);
  if (!guild) return cleanReactInDM(message);

  const mainGuild = cache.guilds.get(mail.mainGuildID);
  if (!mainGuild) return cleanReactInDM(message);

  const embed = botCache.helpers.authorEmbed(message).setDescription(content).setFooter(message.author.id);

  const [attachment] = message.attachments;
  if (attachment) embed.setImage(attachment.url);

  const channel = cache.channels.get(mail.channelID);
  if (!channel) return cleanReactInDM(message);

  if (
    !(await botHasChannelPermissions(mail.channelID, ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"]))
  ) {
    return cleanReactInDM(message);
  }

  const settings = await db.guilds.get(mail.mainGuildID);
  const alertRoleIDs = settings?.mailsRoleIDs || [];

  if (!attachment && content.length < 1900) {
    await sendMessage(channel.id, {
      content: `${alertRoleIDs
        .filter((id) => guild.roles.has(id))
        .map((roleID) => `<@&${roleID}>`)
        .join(" ")} 📬 **${message.author.username}#${message.author.discriminator}** ${content}`,
      mentions: { roles: alertRoleIDs, parse: [] },
    });
  } else {
    // Await so the message sends before we make roles unmentionable again
    await sendMessage(channel.id, {
      embed,
      content: alertRoleIDs
        .filter((id) => guild.roles.has(id))
        .map((roleID) => `<@&${roleID}>`)
        .join(" "),
      file: embed.embedFile,
      mentions: { roles: alertRoleIDs, users: [message.author.id], parse: [] },
    });
  }

  const logChannelID = botCache.guildMailLogsChannelIDs.get(message.guildID);
  if (logChannelID) await sendEmbed(logChannelID, embed);

  return cleanReactInDM(message, "success");
};

botCache.helpers.mailHandleSupportChannel = async function (message) {
  const mail = await db.mails.findOne({
    mainGuildID: message.guildID,
    userID: message.author.id,
  });
  // If the user doesn't have an open mail we need to create one
  if (!mail) {
    return botCache.helpers.mailCreate(message, message.content);
  }

  // User does have an open mail
  const guild = cache.guilds.get(mail.guildID);
  if (!guild) return botCache.helpers.reactError(message);

  const embed = botCache.helpers.authorEmbed(message).setDescription(message.content).setFooter(message.author.id);
  if (message.attachments.length) {
    const [attachment] = message.attachments;
    if (attachment) {
      const blob = await fetch(attachment.url)
        .then((res) => res.blob())
        .catch(() => undefined);
      if (blob) embed.attachFile(blob, attachment.filename);
    }
  }

  const channel = cache.channels.get(mail.channelID);
  if (!channel) return botCache.helpers.mailCreate(message, message.content);

  if (
    !(await botHasChannelPermissions(mail.channelID, ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"]))
  ) {
    return botCache.helpers.reactError(message);
  }

  const settings = await db.guilds.get(mail.mainGuildID);
  const alertRoleIDs = settings?.mailsRoleIDs || [];

  // Await so the message sends before we make roles unmentionable again
  await sendMessage(channel.id, {
    embed,
    content: alertRoleIDs
      .filter((id) => guild.roles.has(id))
      .map((roleID) => `<@&${roleID}>`)
      .join(" "),
    file: embed.embedFile,
    mentions: { roles: alertRoleIDs, users: [message.author.id], parse: [] },
  });

  const logChannelID = botCache.guildMailLogsChannelIDs.get(message.guildID);
  if (logChannelID) await sendEmbed(logChannelID, embed);

  await message.alert(translate(message.guildID, "strings:MAIL_REPLY_SENT_SUPPORT"));
};

botCache.helpers.mailCreate = async function (message, content, member) {
  const mailUser = member || cache.members.get(message.author.id);
  if (!mailUser) return botCache.helpers.reactError(message);

  const settings = await db.guilds.get(message.guildID);
  if (!settings?.mailsEnabled) return botCache.helpers.reactError(message);

  const channelName = mailUser.tag.replace(channelNameRegex, ``).toLowerCase();

  const firstWord = content.substring(0, content.indexOf(" ") - 1).toLowerCase();
  const label = await db.labels.findOne({
    guildID: message.guildID,
    name: firstWord,
  });

  const guild = cache.guilds.get(settings.mailsGuildID || message.guildID);
  if (!guild) return botCache.helpers.reactError(message);

  let category = cache.channels.get(settings.mailCategoryID);
  if (!(await botHasPermission(guild.id, ["MANAGE_CHANNELS"]))) {
    return botCache.helpers.reactError(message);
  }

  const prefix = parsePrefix(message.guildID);
  const manualEmbed = botCache.helpers
    .authorEmbed(message)
    .setDescription(
      [
        translate(message.guildID, "strings:REPLY", { prefix }),
        translate(message.guildID, "strings:REPLY_ANON", { prefix }),
        translate(message.guildID, "strings:CLOSE", { prefix }),
        translate(message.guildID, "strings:CLOSE_SILENTLY", { prefix }),
      ].join("\n")
    )
    .setTimestamp();

  const alertRoleIDs = settings?.mailsRoleIDs || [];

  const embed = botCache.helpers.authorEmbed(message).setDescription(content).setFooter(message.author.id);

  // If this is a vip guild, begin Q&A sequence
  if (botCache.vipGuildIDs.has(message.guildID)) {
    const messageIDs: string[] = [];

    const CANCEL_OPTIONS = translate(message.guildID, "strings:CANCEL_OPTIONS", { returnObjects: true });

    for (const data of settings.mailQuestions) {
      const options = data.options || [];
      const isMessageType = data.type === "message";
      const questionMessage = await sendResponse(
        message,
        data.type === "reaction"
          ? [data.text, "", ...options.map((option, index) => `${index + 1}. ${option}`)].join("\n")
          : data.text
      );
      if (!questionMessage) return;

      messageIDs.push(questionMessage.id);

      if (!isMessageType) {
        await addReactions(
          questionMessage.channelID,
          questionMessage.id,
          Object.values(botCache.constants.emojis.numbers.slice(0, options.length)),
          true
        );
      }
      const response = isMessageType
        ? await botCache.helpers.needMessage(message.author.id, questionMessage.channelID)
        : await botCache.helpers.needReaction(mailUser.id, questionMessage.id);
      if (!response) {
        break;
      }

      if (typeof response === "string") {
        const index = botCache.constants.emojis.numbers.findIndex((e) => e === response);
        const selectedOption = options[index];
        if (!selectedOption) {
          break;
        }

        // Check if this value has a label
        const label = await db.labels.findOne({
          name: selectedOption.toLowerCase(),
          mainGuildID: message.guildID,
        });
        // Set the label to be used
        if (label) {
          const labelCategory = cache.channels.get(label.categoryID);
          if (labelCategory) category = labelCategory;
        }

        embed.addField(data.name, selectedOption, true);
      } else {
        if (CANCEL_OPTIONS.includes(message.content.toLowerCase())) break;
        messageIDs.push(response.id);
        if (response.content) {
          embed.addField(data.name, response.content, true);
        }

        const [attachment] = message.attachments;
        if (attachment) embed.setImage(attachment.url);
      }
    }

    if (messageIDs.length >= 2) {
      await deleteMessages(message.channelID, messageIDs).catch(console.log);
    } else if (messageIDs[0]) {
      await deleteMessageByID(message.channelID, messageIDs[0]).catch(console.log);
    }

    if (embed.fields.length !== settings.mailQuestions.length) {
      return botCache.helpers.reactError(message);
    }
  }

  // Make sure the category can be read since we need to create a channel inside this category
  if (category && !(await botHasChannelPermissions(category.id, ["VIEW_CHANNEL"]))) {
    return botCache.helpers.reactError(message);
  }

  if (category && (await categoryChildrenIDs(guild.id, category.id)).size === 50) {
    return botCache.helpers.reactError(message);
  }

  // Creates a text channel by default and we move it to the mail category
  const channel = await createGuildChannel(guild, channelName, {
    type: ChannelTypes.GUILD_TEXT,
    parent_id: category?.id,
  });

  const finalContent = content.substring(label ? content.indexOf(" ") + 1 : 0);
  const topic = finalContent.substring(0, finalContent.length > 50 ? 50 : finalContent.length);

  await db.mails.create(channel.id, {
    channelID: channel.id,
    userID: mailUser.id,
    guildID: guild.id,
    mainGuildID: message.guildID,
    topic,
  });

  if (!(await botHasChannelPermissions(channel.id, ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"]))) {
    return botCache.helpers.reactError(message);
  }

  await sendEmbed(channel.id, manualEmbed);
  await sendMessage(channel.id, {
    embed,
    content: alertRoleIDs
      .filter((id) => guild.roles.has(id))
      .map((roleID) => `<@&${roleID}>`)
      .join(" "),
    file: embed.embedFile,
    mentions: { roles: alertRoleIDs, users: [message.author.id], parse: [] },
  });

  const logChannelID = botCache.guildMailLogsChannelIDs.get(message.guildID);
  if (logChannelID) await sendEmbed(logChannelID, embed);
  if (!member) await deleteMessage(message).catch(console.log);

  // Handle VIP AutoResponse
  if (settings.mailAutoResponse) {
    await sendDirectMessage(mailUser.id, settings.mailAutoResponse).catch(console.log);
  }
};
