import {
  highestRole,
  higherRolePosition,
  Member,
  botID,
  sendDirectMessage,
  kick,
} from "../../../deps.ts";
import { botCache } from "../../../mod.ts";
import { createCommandAliases } from "../../utils/helpers.ts";
import { PermissionLevels } from "../../types/commands.ts";

botCache.commands.set(`kick`, {
  name: `kick`,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["KICK_MEMBERS"],
  arguments: [
    { name: "member", type: "member" },
    { name: "reason", type: "...string" },
  ],
  guildOnly: true,
  execute: async function (message, args: KickArgs, guild) {
    if (!guild) return;

    const botsHighestRole = highestRole(message.guildID, botID);
    const membersHighestRole = highestRole(
      message.guildID,
      args.member.user.id,
    );
    const modsHighestRole = highestRole(message.guildID, message.author.id);

    if (
      !botsHighestRole || !membersHighestRole ||
      !higherRolePosition(
        message.guildID,
        botsHighestRole.id,
        membersHighestRole.id,
      )
    ) {
      return botCache.helpers.reactError(message);
    }

    if (
      !modsHighestRole || !membersHighestRole ||
      !higherRolePosition(
        message.guildID,
        modsHighestRole.id,
        membersHighestRole.id,
      )
    ) {
      return botCache.helpers.reactError(message);
    }

    await sendDirectMessage(
      args.member.user.id,
      `**You have been kicked from:** *${guild.name}*\n**Moderator:** *${message.author.username}*\n**Reason:** *${args.reason}*`,
    );

    const kicked = await kick(message.guildID, args.member.user.id).catch(() =>
      undefined
    );
    if (!kicked) {
      return botCache.helpers.reactError(message);
    }

    botCache.helpers.createModlog(
      message,
      {
        action: "kick",
        reason: args.reason,
        userID: args.member.user.id,
      },
    );

    botCache.helpers.createModlog(
      message,
      {
        action: "kick",
        reason: args.reason,
        userID: args.member.user.id,
      },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

createCommandAliases("kick", ["k"]);

interface KickArgs {
  member: Member;
  reason: string;
}
