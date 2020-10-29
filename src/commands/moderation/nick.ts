import type { Member } from "../../../deps.ts";
import {
  botID,
  editMember,
  higherRolePosition,
  highestRole,
} from "../../../deps.ts";
import { botCache } from "../../../cache.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `nick`,
  aliases: ["nickname"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["CHANGE_NICKNAME"],
  arguments: [
    { name: "member", type: "member", required: false },
    { name: "userID", type: "snowflake", required: false },
    { name: "nick", type: "string" },
  ],
  guildOnly: true,
  execute: async function (message, args: NicknameArgs, guild) {
    if (!guild) return;

    if (args.member) {
      if (args.member.id === guild.ownerID) {
        return botCache.helpers.reactError(message);
      }

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
    }

    const userID = args.member?.id || args.userID!;
    if (userID === guild.ownerID) return botCache.helpers.reactError(message);

    editMember(message.guildID, userID, { nick: args.nick }).then(() =>
      botCache.helpers.reactSuccess(message)
    ).catch(() => botCache.helpers.reactError(message));
  },
});

interface NicknameArgs {
  member?: Member;
  userID?: string;
  nick: string;
}
