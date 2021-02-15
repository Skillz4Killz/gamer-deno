import { botCache, botID, higherRolePosition, highestRole, kick, sendDirectMessage } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createCommand({
  name: "kick",
  aliases: ["k"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["KICK_MEMBERS"],
  arguments: [
    { name: "member", type: "member" },
    { name: "reason", type: "...string", required: false },
  ] as const,
  guildOnly: true,
  execute: async function (message, args, guild) {
    if (!guild) return;

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

    const REASON = args.reason || translate(message.guildID, "strings:NO_REASON");
    await sendDirectMessage(
      args.member.id,
      `**__You have been kicked__\nServer:** *${guild.name}*\n**Moderator:** *${message.author.username}*\n**Reason:** *${REASON}*`
    ).catch(console.log);

    await kick(message.guildID, args.member.id);

    botCache.helpers.createModlog(message, {
      action: "kick",
      reason: REASON,
      member: args.member,
      userID: args.member.id,
    });

    return botCache.helpers.reactSuccess(message);
  },
});
