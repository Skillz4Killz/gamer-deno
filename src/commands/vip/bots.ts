import { botCache } from "../../../cache.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { fetchMembers, sendMessage } from "../../../deps.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `bots`,
  aliases: ["showbots, botlist"],
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  cooldown: {
    seconds: botCache.constants.milliseconds.MINUTE / 1000 * 30,
  },
  execute: async function (message, _args, guild) {
    if (!guild) return;

    if (guild.memberCount !== guild.members.size) await fetchMembers(guild);

    const text = guild.members
      .filter((m) => Boolean(m.user.bot))
      .array().map((member, index) =>
        `**${index + 1}.** ${member.mention} -> ${member.id}`
      )
      .join("\n")
      .substring(0, 2000);

    return sendMessage(message.channelID, text);
  },
});
