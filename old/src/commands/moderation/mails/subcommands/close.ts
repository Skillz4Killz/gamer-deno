import { botCache, cache, deleteChannel, sendDirectMessage, sendMessage } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { Embed } from "../../../../utils/Embed.ts";
import { createSubcommand, sendEmbed } from "../../../../utils/helpers.ts";
import { translate } from "../../../../utils/i18next.ts";

createSubcommand("mail", {
  name: "close",
  aliases: ["c"],
  arguments: [{ name: "content", type: "...string" }] as const,
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  botChannelPermissions: ["MANAGE_CHANNELS"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async (message, args, guild) => {
    const channelName = cache.channels.get(message.channelID)?.name;
    const member = cache.members.get(message.author.id);
    if (!member) return;

    const mail = await db.mails.get(message.channelID);
    // If the mail could not be found.
    if (!mail) return botCache.helpers.reactError(message);

    // Delete the mail from the database
    await db.mails.delete(message.channelID);

    const embed = new Embed().setAuthor(member.tag, member.avatarURL).setDescription(args.content).setTimestamp();

    await deleteChannel(message.guildID, message.channelID, args.content).catch(console.log);

    const logChannelID = botCache.guildMailLogsChannelIDs.get(message.guildID);
    if (logChannelID) await sendEmbed(logChannelID, embed);

    try {
      await sendDirectMessage(mail.userID, `**${member.tag}:** ${args.content}`);
      const ratingsChannel = cache.channels.get(botCache.guildMailRatingsChannelIDs.get(message.guildID)!);
      if (!ratingsChannel) return;

      const feedbackEmbed = new Embed()
        .setTitle(translate(message.guildID, "strings:MAIL_CLOSED"))
        .addField(
          translate(message.guildID, "strings:MAIL_RATING"),
          translate(message.guildID, "strings:MAIL_VOTE_NOW")
        )
        .setTimestamp();

      const feedback = await sendDirectMessage(mail.userID, {
        embed: feedbackEmbed,
      });

      const reactions = [
        botCache.constants.emojis.gamer.hug,
        botCache.constants.emojis.gamer.star,
        botCache.constants.emojis.gamer.warn,
        botCache.constants.emojis.gamer.ban,
      ];
      await feedback.addReactions(reactions, true);
      const reaction = await botCache.helpers.needReaction(mail.userID, feedback.id);

      const emoji = reactions.find((r) => r.endsWith(`${reaction}>`));

      const rating = translate(
        message.guildID,
        emoji === botCache.constants.emojis.gamer.hug
          ? "strings:MAIL_GREAT"
          : emoji === botCache.constants.emojis.gamer.star
          ? "strings:MAIL_OK"
          : emoji === botCache.constants.emojis.gamer.warn
          ? "strings:MAIL_NOT_GOOD"
          : "strings:MAIL_BAD",
        { mention: `<@!${member.id}>`, username: channelName, emoji }
      );

      await feedback.delete();
      if (!emoji) return;

      await sendMessage(ratingsChannel.id, {
        content: rating,
        mentions: { users: [member.id], parse: [] },
      });
    } catch (error) {
      console.log("Something went wrong in the mail close try catch");
      console.log(error);
    }
  },
});
