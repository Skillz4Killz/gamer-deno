import { botCache, cache } from "../../../../deps.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "leaderboard",
  aliases: ["lb", "leaderboards"],
  guildOnly: true,
  permissionLevels: [
    PermissionLevels.BOT_OWNER,
    PermissionLevels.BOT_DEVS,
    PermissionLevels.BOT_SUPPORT,
  ],
  botChannelPermissions: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "ATTACH_FILES",
    "EMBED_LINKS",
  ],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "member", type: "member", required: false },
  ] as const,
  execute: async function (message, args) {
    if (!args.member) args.member = cache.members.get(message.author.id)!;
    if (!args.member) return botCache.helpers.reactError(message);

    const buffer = await botCache.helpers.makeLocalCanvas(
      message,
      args.member,
    );
    if (!buffer) return botCache.helpers.reactError(message);

    const embed = botCache.helpers.authorEmbed(message).attachFile(
      buffer,
      "profile.jpg",
    );
    return message.reply("This command is currently disabled due to a database problem.");
  },
});
