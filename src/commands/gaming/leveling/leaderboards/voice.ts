import { botCache, cache } from "../../../../../deps.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("leaderboard", {
  name: "voice",
  aliases: ["v"],
  guildOnly: true,
  vipServerOnly: true,
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
  arguments: [{ name: "member", type: "member", required: false }] as const,
  execute: async function (message, args) {
    if (!args.member) args.member = cache.members.get(message.author.id)!;
    if (!args.member) return botCache.helpers.reactError(message);

    const buffer = await botCache.helpers.makeVoiceCanvas(message, args.member);
    if (!buffer) return botCache.helpers.reactError(message);

    const embed = botCache.helpers.authorEmbed(message).attachFile(buffer, "lb.jpg");
    return message.send({ embed, file: embed.embedFile });
  },
});
