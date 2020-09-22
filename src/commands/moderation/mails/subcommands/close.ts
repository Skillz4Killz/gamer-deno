import { botCache } from "../../../../../mod.ts";
import type {
  createSubcommand,
  sendEmbed,
} from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import type { mailsDatabase } from "../../../../database/schemas/mails.ts";
import type {
  sendMessage,
  sendDirectMessage,
  avatarURL,
  deleteChannel,
  addReactions,
  deleteMessage,
} from "../../../../../deps.ts";
import type { Embed } from "../../../../utils/Embed.ts";
import { translate } from "../../../../utils/i18next.ts";

createSubcommand("mail", {
  name: "close",
  aliases: ["c"],
  arguments: [
    { name: "content", type: "...string" },
  ],
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  botChannelPermissions: ["MANAGE_CHANNELS"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async (message, args: MailArgs, guild) => {
    const channelName = message.channel.name;
    const member = message.member();
    if (!member) return;

    const mail = await mailsDatabase.findOne({ channelID: message.channelID });
    // If the mail could not be found.
    if (!mail) return botCache.helpers.reactError(message);

    // Delete the mail from the database
    mailsDatabase.deleteOne({ channelID: message.channelID });

    const embed = new Embed()
      .setAuthor(member.tag, avatarURL(member))
      .setDescription(args.content)
      .setTimestamp();

    deleteChannel(message.guildID, message.channelID, args.content);

    const logChannel = guild?.channels.find((c) =>
      Boolean(c.topic?.includes("gamerMailLogChannel"))
    );
    if (!logChannel) return;

    sendEmbed(logChannel.id, embed);

    try {
      await sendDirectMessage(
        mail.userID,
        `**${member.tag}:** ${args.content}`,
      );
      const ratingsChannel = guild?.channels.find((c) =>
        Boolean(c.topic?.includes("gamerMailRatingChannel"))
      );
      if (!ratingsChannel) return;

      const feedbackEmbed = new Embed()
        .setTitle(translate(message.guildID, "commands/mail:CLOSED"))
        .addField(
          translate(message.guildID, "commands/mail:RATING"),
          translate(message.guildID, "commands/mail:VOTE_NOW"),
        )
        .setTimestamp();

      const feedback = await sendDirectMessage(
        mail.userID,
        { embed: feedbackEmbed },
      );

      const reactions = [
        botCache.constants.emojis.gamer.hug,
        botCache.constants.emojis.gamer.star,
        botCache.constants.emojis.gamer.warn,
        botCache.constants.emojis.gamer.ban,
      ];
      await addReactions(feedback.channelID, feedback.id, reactions);
      const reaction = await botCache.helpers.needReaction(
        mail.userID,
        feedback.id,
      );
      if (!reaction) return;

      const emoji = reactions.find((r) => r.endsWith(`${reaction}>`));

      const rating = translate(
        message.guildID,
        emoji === botCache.constants.emojis.gamer.hug
          ? "commands/mail:GREAT"
          : emoji === botCache.constants.emojis.gamer.star
          ? "commands/mail:OK"
          : emoji === botCache.constants.emojis.gamer.warn
          ? "commands/mail:NOT_GOOD"
          : "commands/mail:BAD",
        { mention: member.mention, username: channelName, emoji },
      );

      deleteMessage(feedback).catch(() => undefined);
      if (!emoji) return;

      sendMessage(
        ratingsChannel,
        {
          content: translate(
            message.guildID,
            "commands/mail:VOTE",
            { emoji, username: channelName, mention: member.mention },
          ),
          mentions: { users: [member.user.id], parse: [] },
        },
      );
    } catch (error) {
      console.log("Something went wrong in the mail close try catch");
      console.log(error);
    }
  },
});

interface MailArgs {
  content: string;
}
