import { editMember } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/v9/src/handlers/member.ts";
import type { Member } from "../../../deps.ts";
import { botID, higherRolePosition, highestRole } from "../../../deps.ts";
import { botCache } from "../../../mod.ts";
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
  ],
  guildOnly: true,
  execute: async function (message, args: NicknameArgs, guild) {
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
    }

    const userID = args.userID!;

    editMember(message.guildID, userID, { nick: "new name" });

    return botCache.helpers.reactSuccess(message);
  },
});

interface NicknameArgs {
  member?: Member;
  userID?: string;
  nick: string;
}
