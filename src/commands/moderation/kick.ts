import {
  highestRole,
  higherRolePosition,
  Member,
  botID,
  sendDirectMessage,
} from "../../../deps.ts";
import { botCache } from "../../../mod.ts";
import { createCommandAliases } from "../../utils/helpers.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { kick } from "https://x.nest.land/Discordeno@8.4.4/src/handlers/member.ts";

botCache.commands.set(`kick`, {
  name: `kick`,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["KICK_MEMBERS"],
  arguments: [
    { name: "member", type: "member", required: false },
    { name: "userID", type: "snowflake", required: false },
    { name: "reason", type: "...string" },
  ],
  guildOnly: true,
  execute: async function (message, args: KickArgs, guild) {
    if (!guild) return;

    if (args.member) {
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
    }

    const userID = args.member?.user.id || args.userID!;
    await sendDirectMessage(
      userID,
      `**You have been kicked from:** *${guild.name}*\n**Moderator:** *${message.author.username}*\n**Reason:** *${args.reason}*`,
    );

    kick(message.guildID, userID);

    // TODO: NEED TO ADD MOD LOG SUPPORT
    return botCache.helpers.reactSuccess(message);
  },
});

createCommandAliases("kick", ["k"]);

interface KickArgs {
  member?: Member;
  userID?: string;
  reason: string;
}
