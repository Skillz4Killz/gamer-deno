import type { Member } from "../../deps.ts";

import { botCache } from "../../mod.ts";
import { translate } from "../utils/i18next.ts";
import { Embed } from "../utils/Embed.ts";
import {
  sendAlertResponse,
  sendEmbed,
  sendResponse,
} from "../utils/helpers.ts";
import {
  addReactions,
  botHasChannelPermissions,
  botHasPermission,
  cache,
  categoryChildrenIDs,
  ChannelTypes,
  createGuildChannel,
  deleteMessage,
  deleteMessages,
  getMember,
  Permissions,
  sendDirectMessage,
  sendMessage,
} from "../../deps.ts";
import { db } from "../database/database.ts";

const channelNameRegex = /^-+|[^\w-]|-+$/g;

botCache.helpers.mailHandleDM = async function (message, content) {
  // DM will be in english always
  // TODO: optimize this
  const mails = await db.mails.getAll(true).then((data) =>
    data.filter((mail) => mail.userID === message.author.id)
  );

  // If the user has no mails and hes trying to create a mail it needs to error because mails must be created within a guild.
  let [mail] = mails;
  if (!mail) {
    return sendDirectMessage(
      message.author.id,
      translate(message.guildID, "commands/mail:NEW_MAIL_IN_DM"),
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
          `${
            translate(
              message.guildID,
              "commands/mail:NEED_MAIL_ID",
            )
          }\n\n${mailData}`,
        );
      }

      // User provided some id number
      mail = mails[id];
      // Remove the id from the content string
      content = content.substring(2);
    }
  }

  if (!mail) return botCache.helpers.reactError(message);

  const guild = cache.guilds.get(mail.guildID);
  if (!guild) return botCache.helpers.reactError(message);

  const mainGuild = cache.guilds.get(mail.mainGuildID);
  if (!mainGuild) return botCache.helpers.reactError(message);

  const member = mainGuild.members.get(message.author.id) ||
    await getMember(mainGuild.id, message.author.id).catch(() =>
      undefined
    ) as unknown as Member;
  if (!member) return botCache.helpers.reactError(message);

  const embed = new Embed()
    .setAuthor(member.tag, member.avatarURL)
    .setDescription(content)
    .setFooter(message.author.id);

  const [attachment] = message.attachments;
  if (attachment) embed.setImage(attachment.url);

  const channel = guild.channels.get(mail.channelID);
  if (!channel) return botCache.helpers.reactError(message);

  if (
    !botHasChannelPermissions(mail.channelID, [
      Permissions.VIEW_CHANNEL,
      Permissions.SEND_MESSAGES,
      Permissions.EMBED_LINKS,
      Permissions.ATTACH_FILES,
    ])
  ) {
    return botCache.helpers.reactError(message);
  }

  const settings = await db.guilds.get(mail.mainGuildID);
  const alertRoleIDs = settings?.mailsRoleIDs || [];

  if (!attachment && content.length < 1900) {
    await sendMessage(
      channel.id,
      {
        content: `${
          alertRoleIDs
            .filter((id) => guild.roles.has(id))
            .map((roleID) => `<@&${roleID}>`)
            .join(" ")
        } 📬 **${message.author.username}#${message.author.discriminator}** ${content}`,
        mentions: { roles: alertRoleIDs, parse: [] },
      },
    );
  } else {
    // Await so the message sends before we make roles unmentionable again
    await sendMessage(channel.id, {
      embed,
      content: alertRoleIDs
        .filter((id) => guild.roles.has(id))
        .map((roleID) => `<@&${roleID}>`)
        .join(" "),
      file: embed.file,
      mentions: { roles: alertRoleIDs, users: [message.author.id], parse: [] },
    });
  }

  const logChannel = guild.channels.find((c) =>
    Boolean(c.topic?.includes("gamerMailLogChannel"))
  );
  if (logChannel) sendEmbed(logChannel.id, embed);

  return botCache.helpers.reactSuccess(message);
};

botCache.helpers.mailHandleSupportChannel = async function (message) {
  const mail = await db.mails.findOne(
    { mainGuildID: message.guildID, userID: message.author.id },
  );
  // If the user doesn't have an open mail we need to create one
  if (!mail) {
    return botCache.helpers.mailCreate(message, message.content);
  }

  // User does have an open mail
  const guild = cache.guilds.get(mail.guildID);
  if (!guild) return botCache.helpers.reactError(message);

  const member = guild.members.get(message.author.id);
  if (!member) return botCache.helpers.reactError(message);

  const embed = new Embed()
    .setAuthor(member.tag, member.avatarURL)
    .setDescription(message.content)
    .setFooter(message.author.id);
  const [attachment] = message.attachments;
  if (attachment) embed.setImage(attachment.url);

  const channel = guild.channels.get(mail.channelID);
  if (!channel) return botCache.helpers.reactError(message);

  if (
    !botHasChannelPermissions(mail.channelID, [
      Permissions.VIEW_CHANNEL,
      Permissions.SEND_MESSAGES,
      Permissions.EMBED_LINKS,
      Permissions.ATTACH_FILES,
    ])
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
    file: embed.file,
    mentions: { roles: alertRoleIDs, users: [message.author.id], parse: [] },
  });

  const logChannel = guild.channels.find((c) =>
    Boolean(c.topic?.includes("gamerMailLogChannel"))
  );
  if (logChannel) sendEmbed(logChannel.id, embed);

  return sendAlertResponse(
    message,
    translate(message.guildID, "commands/mail:REPLY_SENT_SUPPORT"),
  );
};

botCache.helpers.mailCreate = async function (message, content, member) {
  const mailUser = member ||
    cache.guilds.get(message.guildID)?.members.get(message.author.id);
  if (!mailUser) return botCache.helpers.reactError(message);

  const settings = await db.guilds.get(message.guildID);
  if (!settings?.mailsEnabled) return botCache.helpers.reactError(message);

  const channelName = mailUser.tag.replace(channelNameRegex, ``).toLowerCase();

  const firstWord = content.substring(0, content.indexOf(" ") - 1)
    .toLowerCase();
  const label = await db.labels.findOne({
    guildID: message.guildID,
    name: firstWord,
  });

  const guild = cache.guilds.get(settings.mailsGuildID);
  if (!guild) return botCache.helpers.reactError(message);

  let category = guild.channels.get(settings.mailCategoryID);
  if (!botHasPermission(guild.id, [Permissions.MANAGE_CHANNELS])) {
    return botCache.helpers.reactError(message);
  }

  const manualEmbed = new Embed()
    .setAuthor(mailUser.tag)
    .addField("Reply", "!mail reply")
    .addField("Reply Anonymous", "!mail reply anonymous")
    .addField("Close", "!mail close")
    .addField("Close Silently", "!mail silent")
    .addField("More Help", "Link To Wiki Guide Here")
    .setTimestamp();

  const alertRoleIDs = settings?.mailsRoleIDs || [];

  const embed = new Embed()
    .setAuthor(mailUser.tag)
    .setDescription(content)
    .setFooter(message.author.id);

  // If this is a vip guild, begin Q&A sequence
  if (botCache.vipGuildIDs.has(message.guildID)) {
    const messageIDs: string[] = [];

    const CANCEL_OPTIONS = translate(
      message.guildID,
      "common:CANCEL_OPTIONS",
      { returnObjects: true },
    );

    for (const data of settings.mailQuestions) {
      const options = data.options || [];
      const isMessageType = data.type === "message";
      const questionMessage = await sendResponse(
        message,
        data.type === "reaction"
          ? [
            data.text,
            "",
            ...options.map((option, index) => `${index + 1}. ${option}`),
          ].join("\n")
          : data.text,
      );
      messageIDs.push(questionMessage.id);

      if (!isMessageType) {
        await addReactions(
          questionMessage.channelID,
          questionMessage.id,
          Object.values(
            botCache.constants.emojis.numbers.slice(0, options.length),
          ),
        );
      }
      const response = isMessageType
        ? await botCache.helpers.needMessage(
          message.author.id,
          questionMessage.channelID,
        )
        : await botCache.helpers.needReaction(
          mailUser.id,
          questionMessage.id,
        );
      if (!response) {
        break;
      }

      if (typeof response === "string") {
        const index = botCache.constants.emojis.numbers.findIndex((e) =>
          e === response
        );
        const selectedOption = options[index];
        if (!selectedOption) {
          break;
        }

        // Check if this value has a label
        const label = await db.labels.findOne(
          { name: selectedOption.toLowerCase(), mainGuildID: message.guildID },
        );
        // Set the label to be used
        if (label) {
          const labelCategory = guild.channels.get(label.categoryID);
          if (labelCategory) category = labelCategory;
        }

        embed.addField(data.name, selectedOption);
      } else {
        if (CANCEL_OPTIONS.includes(message.content.toLowerCase())) break;
        messageIDs.push(response.id);
        if (response.content) {
          embed.addField(data.name, response.content);
        }

        const [attachment] = message.attachments;
        if (attachment) embed.setImage(attachment.url);
      }
    }

    deleteMessages(message.channelID, messageIDs).catch(() => undefined);
    if (embed.fields.length !== settings.mailQuestions.length) {
      return botCache.helpers.reactError(message);
    }
  }

  // Make sure the category can be read since we need to create a channel inside this category
  if (
    category &&
    !botHasChannelPermissions(category.id, [Permissions.VIEW_CHANNEL])
  ) {
    return botCache.helpers.reactError(message);
  }

  if (category && categoryChildrenIDs(guild, category.id).size === 50) {
    return botCache.helpers.reactError(message);
  }

  // Creates a text channel by default and we move it to the mail category
  const channel = await createGuildChannel(
    guild,
    channelName,
    { type: ChannelTypes.GUILD_TEXT, parent_id: category?.id },
  );

  const finalContent = content.substring(label ? content.indexOf(" ") + 1 : 0);
  const topic = finalContent.substring(
    0,
    finalContent.length > 50 ? 50 : finalContent.length,
  );

  db.mails.create(channel.id, {
    channelID: channel.id,
    userID: mailUser.id,
    guildID: guild.id,
    mainGuildID: message.guildID,
    topic,
  });

  if (
    !botHasChannelPermissions(channel.id, [
      Permissions.VIEW_CHANNEL,
      Permissions.SEND_MESSAGES,
      Permissions.EMBED_LINKS,
      Permissions.ATTACH_FILES,
    ])
  ) {
    return botCache.helpers.reactError(message);
  }

  await sendEmbed(channel.id, manualEmbed);
  await sendMessage(channel.id, {
    embed,
    content: alertRoleIDs
      .filter((id) => guild.roles.has(id))
      .map((roleID) => `<@&${roleID}>`)
      .join(" "),
    file: embed.file,
    mentions: { roles: alertRoleIDs, users: [message.author.id], parse: [] },
  });

  const logChannel = guild.channels.find((c) =>
    Boolean(c.topic?.includes("gamerMailLogChannel"))
  );
  if (logChannel) sendEmbed(logChannel.id, embed);
  if (!member) deleteMessage(message).catch(() => undefined);

  // Handle VIP AutoResponse
  if (settings.mailAutoResponse) {
    sendDirectMessage(mailUser.id, settings.mailAutoResponse);
  }
};
