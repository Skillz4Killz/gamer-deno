import type { Member } from "../../../deps.ts";

import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";
import {
  higherRolePosition,
  highestRole,
  sendDirectMessage,
  botID,
} from "../../../deps.ts";

botCache.commands.set(`warn`, {
  name: `warn`,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["KICK_MEMBERS"],
  arguments: [
    { name: "member", type: "member" },
    { name: "reason", type: "...string" },
  ],
  guildOnly: true,
  execute: async function (message, args: WarnArgs, guild) {
    if (!guild) return;

    if (args.member) {
      const botsHighestRole = await highestRole(message.guildID, botID);
      const membersHighestRole = await highestRole(
        message.guildID,
        args.member.user.id,
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
    } else {
      if (!args.member) return botCache.helpers.reactError(message);
    }

    const userID = args.member;

    await sendDirectMessage(
      args.member.user.id,
      `**__You have been warned__\nServer:** *${guild.name}*\n**Moderator:** *${message.author.username}*\n**Reason:** *${args.reason}*`,
    ).catch(() => undefined);

    botCache.helpers.createModlog(
      message,
      {
        action: "warn",
        reason: args.reason,
        member: args.member,
        userID: args.member.user.id,
      },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

interface WarnArgs {
  member: Member;
  reason: string;
}
