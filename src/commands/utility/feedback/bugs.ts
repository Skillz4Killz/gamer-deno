import {
  botHasChannelPermissions,
  cache,
  ChannelTypes,
  sendMessage,
} from "../../../../deps.ts";
import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand } from "../../../utils/helpers.ts";
import { Embed } from "../../../utils/Embed.ts";
import { translate } from "../../../utils/i18next.ts";

createCommand({
  name: "bugs",
  aliases: ["bug"],
  guildOnly: true,
  arguments: [
    { name: "text", type: "...string", required: false },
  ] as const,
  execute: async function (message, args, guild) {
    if (!guild) return;

    const settings = await db.guilds.get(message.guildID);
    if (!settings?.bugsChannelID) return botCache.helpers.reactError(message);

    const channel = cache.channels.get(settings.bugsChannelID);
    if (
      !channel ||
      ![ChannelTypes.GUILD_NEWS, ChannelTypes.GUILD_TEXT].includes(channel.type)
    ) {
      return botCache.helpers.reactError(message);
    }

    if (
      !(await botHasChannelPermissions(
        settings.bugsChannelID,
        [
          "SEND_MESSAGES",
          "EMBED_LINKS",
          "ADD_REACTIONS",
          "READ_MESSAGE_HISTORY",
          "MANAGE_EMOJIS",
        ],
      ))
    ) {
      return botCache.helpers.reactError(message);
    }

    if (!settings.bugsQuestions.length) {
      return botCache.helpers.reactError(message);
    }

    const member = cache.members.get(message.author.id)!;
    const embed = new Embed()
      .setThumbnail(member.avatarURL)
      .setAuthor(
        translate(
          message.guildID,
          `strings:BUGS_FROM`,
          { username: member.tag },
        ),
        member.avatarURL,
      )
      .setTimestamp();

    if (message.attachments.length) {
      const [attachment] = message.attachments;
      if (attachment) {
        const blob = await fetch(attachment.url).then((res) => res.blob())
          .catch(
            () => undefined,
          );
        if (blob) embed.attachFile(blob, attachment.filename);
      }
    }

    const splitContent = args.text?.split(` | `) || [];

    for (const [index, question] of settings.bugsQuestions.entries()) {
      const value = splitContent[index];
      // If some text was provided try to prefill all the questions that is possible
      if (splitContent.length && value) {
        embed.addField(question.name, value);
        continue;
      }

      await sendMessage(
        message.channelID,
        `<@!${member.id}>, ${question.text}`,
      );
      const response = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID,
      );
      const CANCEL_OPTIONS = translate(
        message.guildID,
        `strings:CANCEL_OPTIONS`,
        { returnObjects: true },
      );
      if (CANCEL_OPTIONS.includes(response.content.toLowerCase())) return;

      if (response.attachments.length) {
        const [attachment] = response.attachments;
        if (attachment) {
          const blob = await fetch(attachment.url).then((res) => res.blob())
            .catch(
              () => undefined,
            );
          if (blob) embed.attachFile(blob, attachment.filename);
        }
      }

      if (response.content) embed.addField(question.name, response.content);
      // There was no content NOR attachment
      else if (!response.attachments.length) return;
    }

    return botCache.helpers.sendFeedback(
      message,
      channel,
      embed,
      settings,
      true,
    );
  },
});
