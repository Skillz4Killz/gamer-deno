import { botCache, cache, sendMessage } from "../../../../../deps.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("leaderboard", {
  name: "global",
  aliases: ["g"],
  guildOnly: true,
  botChannelPermissions: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "ATTACH_FILES",
    "EMBED_LINKS",
  ],
  arguments: [
    { name: "member", type: "member", required: false },
  ] as const,
  execute: async function (message, args) {
    if (!args.member) args.member = cache.members.get(message.author.id)!;
    if (!args.member) return botCache.helpers.reactError(message);

    const buffer = await botCache.helpers.makeGlobalCanvas(
      message,
      args.member,
    );
    if (!buffer) return botCache.helpers.reactError(message);

    const embed = botCache.helpers.authorEmbed(message).attachFile(
      buffer,
      "profile.jpg",
    );
    return sendMessage(message.channelID, { embed, file: embed.embedFile });
  },
});

// let buffer: Buffer | undefined;
// if (
//   (id && globalTypes.includes(id.toLowerCase())) ||
//   (type && globalTypes.includes(type.toLowerCase()))
// ) {
//   buffer = await Gamer.helpers.leaderboards.makeGlobalCanvas(message, member);
// } else if (
//   (id && voiceTypes.includes(id.toLowerCase())) ||
//   (type && voiceTypes.includes(type.toLowerCase()))
// ) {
//   buffer = await Gamer.helpers.leaderboards.makeVoiceCanvas(message, member);
// } else {
//   buffer = await Gamer.helpers.leaderboards.makeLocalCanvas(message, member);
// }

// if (!buffer) return;

// return message.channel.createMessage(
//   "",
//   { file: buffer, name: `leaderboard.jpg` },
// );
