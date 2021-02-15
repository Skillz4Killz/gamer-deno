import { botCache, cache, fetchMembers } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("roles", {
  name: "members",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  botChannelPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [{ name: "role", type: "role" }] as const,
  execute: async function (message, args, guild) {
    if (!guild) return;

    const guildMembersCached = cache.members.filter((m) => m.guilds.has(message.guildID));
    if (guildMembersCached.size !== guild.memberCount) {
      await fetchMembers(guild);
    }

    const texts: string[] = [];

    let botCount = 0;
    let memberCount = 0;

    for (const member of cache.members.values()) {
      if (!member.guilds.has(message.guildID)) continue;

      // If not everyone role and member doesnt have this role skip
      if (message.guildID !== args.role.id && !member.guilds.get(message.guildID)?.roles.includes(args.role.id)) {
        continue;
      }

      if (member.bot) botCount++;
      else memberCount++;

      texts.push(`<@!${member.id}> ${member.tag} [**${member.id}**]`);
    }

    // Add to the top and bottom so its easier to see
    texts.unshift(`${botCount} 🤖 | ${memberCount} 👤`);
    texts.push(`${botCount} 🤖 | ${memberCount} 👤`);

    const responses = botCache.helpers.chunkStrings(texts);

    for (const response of responses) {
      await message.send({ content: response, mentions: { parse: [] } }).catch(console.log);
    }
  },
});
