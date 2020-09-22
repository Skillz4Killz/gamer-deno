import { botCache } from "../../../../../mod.ts";
import type { createSubcommand, sendEmbed } from "../../../../utils/helpers.ts";
import type { PermissionLevels } from "../../../../types/commands.ts";
import type { mailsDatabase } from "../../../../database/schemas/mails.ts";
import type { tagsDatabase } from "../../../../database/schemas/tags.ts";
import type {
  sendMessage,
  sendDirectMessage,
  avatarURL,
  cache,
} from "../../../../../deps.ts";
import type { Embed } from "../../../../utils/Embed.ts";
import { translate } from "../../../../utils/i18next.ts";

createSubcommand("mail", {
  name: "reply",
  aliases: ["r"],
  arguments: [
    {
      name: "anonymous",
      type: "string",
      literals: ["anonymous"],
      required: false,
    },
    { name: "content", type: "...string" },
  ],
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async (message, args: MailReplyArgs, guild) => {
    if (!guild) return botCache.helpers.reactError(message);

    const member = message.member();
    if (!member) return botCache.helpers.reactError(message);

    const mail = await mailsDatabase.findOne({ channelID: message.channelID });
    if (!mail) return botCache.helpers.reactError(message);

    const logChannel = guild.channels.find((c) =>
      Boolean(c.topic?.includes("gamerMailLogChannel"))
    );

    // If the moderator is trying to send a tag
    if (args.content.split(" ").length === 1) {
      const tag = await tagsDatabase.findOne({
        guildID: message.guildID,
        mailOnly: true,
        name: args.content.toLowerCase(),
      });

      if (tag) {
        // Transform the tag string
        const transformed = await botCache.helpers.variables(
          tag.embedCode,
          member,
          guild,
          message.member(),
        );

        let success = false;
        try {
          // Convert the string to JSON
          const embed = JSON.parse(transformed);
          sendDirectMessage(mail.userID, { content: embed.plaintext, embed });
          // Tell the user who sent them the message above because the tag might not be clear
          sendDirectMessage(
            mail.userID,
            translate(
              message.guildID,
              "commands/mail:TAG_SENT_BY",
              { username: member.tag, guild: guild.name },
            ),
          );
          // Tell the mod the message was sent
          botCache.helpers.reactSuccess(message);
          // Show the tag sent to the mods
          sendMessage(
            message.channel,
            { content: embed.plaintext, embed },
          );
          success = true;

          if (logChannel) {
            sendMessage(logChannel, { content: embed.plaintext, embed });
          }
        } catch (error) {
          // Something went wrong somewhere so show it failed
          return botCache.helpers.reactError(message);
        }

        // Some error happened so cancel out
        if (!success) return;
      }
    }

    const mainGuild = cache.guilds.get(mail.mainGuildID);
    if (!mainGuild) return;

    const supportChannel = mainGuild?.channels.find((c) =>
      Boolean(c.topic?.includes("gamerSupportChannel"))
    );

    const embed = new Embed()
      .setAuthor(
        args.anonymous && botCache.vipGuildIDs.has(mainGuild.id)
          ? mainGuild.name
          : member.tag,
        avatarURL(member),
      )
      .setDescription(args.content)
      .setTimestamp();

    const [attachment] = message.attachments;
    if (args.content.length < 1900 && !attachment) {
      sendDirectMessage(
        mail.userID,
        `**${
          args.anonymous && botCache.vipGuildIDs.has(mainGuild.id)
            ? mainGuild.name
            : member.tag
        }:** ${args.content}`,
      );
    } else {
      if (attachment) embed.setImage(attachment.url);
      sendDirectMessage(mail.userID, { embed });
    }

    if (logChannel) sendEmbed(logChannel.id, embed);

    return botCache.helpers.reactSuccess(message);
  },
});

interface MailReplyArgs {
  content: string;
  anonymous?: "anonymous";
}
