import { botCache, cache, deleteChannel } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { Embed } from "../../../../utils/Embed.ts";
import { createSubcommand, sendEmbed } from "../../../../utils/helpers.ts";
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
  execute: async (message) => {
    const member = cache.members.get(message.author.id);
    if (!member) return;

    const mail = await db.mails.get(message.channelID);
    // If the mail could not be found.
    if (!mail) return botCache.helpers.reactError(message);

    // Delete the mail from the database
    await db.mails.delete(message.channelID);

    const embed = new Embed()
      .setAuthor(member.tag, member.avatarURL)
      .setDescription(translate(message.guildID, "strings:MAIL_SILENT_CLOSE"))
      .setTitle(cache.channels.get(message.channelID)?.name || "")
      .setTimestamp();

    await deleteChannel(message.guildID, message.channelID, translate(message.guildID, "strings:MAIL_SILENT_CLOSE"));

    const logChannelID = botCache.guildMailLogsChannelIDs.get(message.guildID);
    if (logChannelID) return sendEmbed(logChannelID, embed);
  },
});
