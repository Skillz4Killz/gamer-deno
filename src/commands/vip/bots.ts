import { botCache, cache, fetchMembers } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `bots`,
  aliases: ["showbots, botlist"],
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  cooldown: {
    seconds: (botCache.constants.milliseconds.MINUTE / 1000) * 30,
  },
  execute: async function (message, _args, guild) {
    if (!guild) return;

    const cachedGuildMembers = cache.members.filter((m) => m.guilds.has(message.guildID));
    if (guild.memberCount !== cachedGuildMembers.size) {
      await fetchMembers(guild);
    }

    const text = cache.members
      .filter((m) => Boolean(m.bot) && m.guilds.has(message.guildID))
      .array()
      .map((member, index) => `**${index + 1}.** <@!${member.id}> (${member.id})`)
      .join("\n")
      .substring(0, 2000);

    return message.send(text);
  },
});
