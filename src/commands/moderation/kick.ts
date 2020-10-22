import type { Member } from "../../../deps.ts";

import {
  botID,
  higherRolePosition,
  highestRole,
  kick,
  sendDirectMessage,
} from "../../../deps.ts";
import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `kick`,
  aliases: ["k"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["KICK_MEMBERS"],
  arguments: [
    { name: "member", type: "member" },
    { name: "reason", type: "...string" },
  ],
  guildOnly: true,
  execute: async function (message, args: KickArgs, guild) {
    if (!guild) return;

    const botsHighestRole = await highestRole(message.guildID, botID);
    const membersHighestRole = await highestRole(
      message.guildID,
      args.member.id,
    );
    const modsHighestRole = await highestRole(
      message.guildID,
      message.author.id,
    );

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
      args.member.id,
      `**__You have been kicked__\nServer:** *${guild.name}*\n**Moderator:** *${message.author.username}*\n**Reason:** *${args.reason}*`,
    );

    const kicked = await kick(message.guildID, args.member.id).catch(() =>
      undefined
    );
    if (!kicked) {
      return botCache.helpers.reactSuccess(message);
    }

    botCache.helpers.createModlog(
      message,
      {
        action: "kick",
        reason: args.reason,
        member: args.member,
        userID: args.member.id,
      },
    );
  },
});

interface KickArgs {
  member: Member;
  reason: string;
}
