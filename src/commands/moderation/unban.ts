import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { getBans, sendDirectMessage, unban } from "../../../deps.ts";

botCache.commands.set(`unban`, {
  name: `unban`,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["BAN_MEMBERS"],
  arguments: [
    { name: "userID", type: "snowflake", required: true },
    { name: "reason", type: "...string" },
  ],
  guildOnly: true,
  execute: async function (message, args: UnbanArgs, guild) {
    if (!guild) return botCache.helpers.reactError(message);

    // TODO: Skillz u silly goose, make a way to fetch 1 ban
    const banned = await getBans(message.guildID);
    if (!banned.has(args.userID)) return botCache.helpers.reactError(message);

    sendDirectMessage(
      args.userID,
      `**You have been unbanned from:** ${guild.name}\n**Moderator:** ${message.author.username}\n**Reason:** ${args.reason}.`,
    ).catch(() => undefined);

    unban(message.guildID, args.userID);

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
