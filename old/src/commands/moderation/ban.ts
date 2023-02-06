import { ban, botCache, botID, higherRolePosition, highestRole, sendDirectMessage } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createCommand({
  name: "ban",
  aliases: ["b"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["BAN_MEMBERS"],
  arguments: [
    { name: "member", type: "member", required: false },
    { name: "userID", type: "snowflake", required: false },
    { name: "reason", type: "...string", required: false },
  ] as const,
  guildOnly: true,
  execute: async function (message, args, guild) {
    if (!guild) return;

    if (args.member) {
      const botsHighestRole = await highestRole(message.guildID, botID);
      const membersHighestRole = await highestRole(message.guildID, args.member.id);
      const modsHighestRole = await highestRole(message.guildID, message.author.id);

      if (
        !botsHighestRole ||
        !membersHighestRole ||
        !(await higherRolePosition(message.guildID, botsHighestRole.id, membersHighestRole.id))
      ) {
        return botCache.helpers.reactError(message);
      }

      if (
        !modsHighestRole ||
        !membersHighestRole ||
        !(await higherRolePosition(message.guildID, modsHighestRole.id, membersHighestRole.id))
      ) {
        return botCache.helpers.reactError(message);
      }
    } else {
      if (!args.userID) return botCache.helpers.reactError(message);

      const banned = await message.guild?.bans();
      if (banned?.has(args.userID)) return botCache.helpers.reactError(message);
    }

    const userID = args.member?.id || args.userID!;

    const REASON = args.reason || translate(message.guildID, "strings:NO_REASON");
    await sendDirectMessage(
      userID,
      `**__You have been banned__\nServer:** *${guild.name}*\n**Moderator:** *${message.author.username}*\n**Reason:** *${REASON}*`
    ).catch(console.log);

    await ban(message.guildID, userID, {
      days: 1,
      reason: REASON,
    });

    botCache.helpers.createModlog(message, {
      action: "ban",
      reason: REASON,
      member: args.member,
      userID: userID,
    });

    return botCache.helpers.reactSuccess(message);
  },
});
