import { avatarURL, deleteChannel } from "../../../../../deps.ts";
import { botCache } from "../../../../../mod.ts";
import { createSubcommand, sendEmbed } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { mailsDatabase } from "../../../../database/schemas/mails.ts";
import { Embed } from "../../../../utils/Embed.ts";
import { translate } from "../../../../utils/i18next.ts";

createSubcommand("mail", {
  name: "silent",
  aliases: ["s"],
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  botChannelPermissions: ["MANAGE_CHANNELS"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async (message, args, guild) => {
    const member = message.member();
    if (!member) return;

    const mail = await mailsDatabase.findOne({ channelID: message.channelID });
    // If the mail could not be found.
    if (!mail) return botCache.helpers.reactError(message);

    // Delete the mail from the database
    mailsDatabase.deleteOne({ channelID: message.channelID });

    const embed = new Embed()
      .setAuthor(member.tag, avatarURL(member))
      .setDescription(translate(message.guildID, "commands/mail:SILENT_CLOSE"))
      .setTitle(message.channel.name || "")
      .setTimestamp();

    deleteChannel(message.guildID, message.channelID, args.content);

    const logChannel = guild?.channels.find((c) =>
      Boolean(c.topic?.includes("gamerMailLogChannel"))
    );
    if (!logChannel) return;

    sendEmbed(logChannel.id, embed);
  },
});
