import { botCache, getBan, sendDirectMessage, unban } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "unban",
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["BAN_MEMBERS"],
  arguments: [
    { name: "userID", type: "snowflake" },
    { name: "reason", type: "...string" },
  ] as const,
  guildOnly: true,
  execute: async function (message, args, guild) {
    if (!guild) return botCache.helpers.reactError(message);

    const banned = await getBan(message.guildID, args.userID);
    if (!banned) return botCache.helpers.reactError(message);

    await sendDirectMessage(
      args.userID,
      `**__You have been unbanned__\nServer:** *${guild.name}*\n**Moderator:** *${message.author.username}*\n**Reason:** *${args.reason}*`
    ).catch(console.log);

    unban(message.guildID, args.userID);

    botCache.helpers.createModlog(message, {
      action: "unban",
      reason: args.reason,
      userID: args.userID,
    });

    return botCache.helpers.reactSuccess(message);
  },
});
