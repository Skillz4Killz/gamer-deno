import type { Member } from "../../../deps.ts";

import {
  ban,
  botID,
  getBans,
  higherRolePosition,
  highestRole,
  sendDirectMessage,
} from "../../../deps.ts";
import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `ban`,
  aliases: ["b"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["BAN_MEMBERS"],
  arguments: [
    { name: "member", type: "member", required: false },
    { name: "userID", type: "snowflake", required: false },
    { name: "reason", type: "...string" },
  ],
  guildOnly: true,
  execute: async function (message, args: BanArgs, guild) {
    if (!guild) return;

    if (args.member) {
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
    } else {
      if (!args.userID) return botCache.helpers.reactError(message);

      const banned = await getBans(message.guildID);
      if (banned.has(args.userID)) return botCache.helpers.reactError(message);
    }

    const userID = args.member?.user.id || args.userID!;

    await sendDirectMessage(
      userID,
      `**__You have been banned__\nServer:** *${guild.name}*\n**Moderator:** *${message.author.username}*\n**Reason:** *${args.reason}*`,
    ).catch(() => undefined);

    ban(message.guildID, userID, {
      days: 1,
      reason: args.reason,
    });

    botCache.helpers.createModlog(
      message,
      {
        action: "ban",
        reason: args.reason,
        member: args.member,
        userID: args.member?.user.id,
      },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

interface BanArgs {
  member?: Member;
  userID?: string;
  reason: string;
}
