import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { getBan, sendDirectMessage, unban } from "../../../deps.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `unban`,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["BAN_MEMBERS"],
  arguments: [
    { name: "userID", type: "snowflake" },
    { name: "reason", type: "...string" },
  ],
  guildOnly: true,
  execute: async function (message, args: UnbanArgs, guild) {
    if (!guild) return botCache.helpers.reactError(message);

    // TODO: Skillz u silly goose, make a way to fetch 1 ban
    const banned = await getBan(message.guildID, args.userID);
    if (!banned) return botCache.helpers.reactError(message);

    sendDirectMessage(
      args.userID,
      `**__You have been unbanned__\nServer:** *${guild.name}*\n**Moderator:** *${message.author.username}*\n**Reason:** *${args.reason}*`,
    ).catch(() => undefined);

    await unban(message.guildID, args.userID);

    botCache.helpers.createModlog(
      message,
      {
        action: "unban",
        reason: args.reason,
        userID: args.userID,
      },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

interface UnbanArgs {
  userID: string;
  reason: string;
}
