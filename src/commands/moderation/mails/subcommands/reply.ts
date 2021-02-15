import { botCache, cache, sendDirectMessage, sendMessage } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { Embed } from "../../../../utils/Embed.ts";
import { createSubcommand, sendEmbed } from "../../../../utils/helpers.ts";
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
    { name: "content", type: "...string", required: false },
  ] as const,
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async (message, args, guild) => {
    if (!guild) return botCache.helpers.reactError(message);

    const member = cache.members.get(message.author.id);
    if (!member) return botCache.helpers.reactError(message);

    const mail = await db.mails.get(message.channelID);
    if (!mail) return botCache.helpers.reactError(message);

    if (!args.content) args.content = "";

    const logChannelID = botCache.guildMailLogsChannelIDs.get(message.guildID);

    // If the moderator is trying to send a tag
    if (args.content.split(" ").length === 1) {
      const tag = await db.tags.findOne({
        guildID: message.guildID,
        mailOnly: true,
        name: args.content.toLowerCase(),
      });

      if (tag) {
        // Transform the tag string
        const transformed = await botCache.helpers.variables(tag.embedCode, member, guild, member);

        let success = false;
        try {
          // Convert the string to JSON
          const embed = JSON.parse(transformed);
          await sendDirectMessage(mail.userID, {
            content: embed.plaintext,
            embed,
          });
          // Tell the user who sent them the message above because the tag might not be clear
          await sendDirectMessage(
            mail.userID,
            translate(message.guildID, "strings:MAIL_TAG_SENT_BY", {
              username: member.tag,
              guild: guild.name,
            })
          );
          // Tell the mod the message was sent
          await botCache.helpers.reactSuccess(message);
          // Show the tag sent to the mods
          await sendMessage(message.channelID, {
            content: embed.plaintext,
            embed,
          });
          success = true;

          if (logChannelID) {
            await sendMessage(logChannelID, {
              content: embed.plaintext,
              embed,
            });
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

    const embed = new Embed()
      .setAuthor(
        args.anonymous && botCache.vipGuildIDs.has(mainGuild.id) ? mainGuild.name : member.tag,
        args.anonymous && botCache.vipGuildIDs.has(mainGuild.id) ? mainGuild.iconURL() : member.avatarURL
      )
      .setDescription(args.content)
      .setTimestamp();

    const [attachment] = message.attachments;
    if (attachment) embed.setImage(attachment.url);
    await sendDirectMessage(mail.userID, { embed });

    if (logChannelID) await sendEmbed(logChannelID, embed);

    return botCache.helpers.reactSuccess(message);
  },
});
