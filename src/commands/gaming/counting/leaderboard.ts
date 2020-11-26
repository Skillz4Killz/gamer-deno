import { botCache, cache, sendMessage } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("counting", {
  name: "leaderboard",
  aliases: ["lb", "leaderboards"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
  guildOnly: true,
  cooldown: {
    seconds: 30,
    allowedUses: 2,
  },
  execute: async function (message, args, guild) {
    const leaderboards =
      (await db.counting.findMany({ localOnly: false }, true)).sort((a, b) =>
        b.count - a.count
      );
    const index = leaderboards.findIndex((lb) =>
      lb.guildID === message.guildID
    );
    // Count not find this server
    if (index < 0) return botCache.helpers.reactError(message);

    const current = leaderboards[index];
    const top = leaderboards.slice(0, 9);
    const above = index < 10
      ? leaderboards.slice(0, 9)
      : leaderboards.slice(index - 9, index);
    const below = index < 10
      ? leaderboards.slice(10, 19)
      : leaderboards.slice(index + 1, index + 9);

    const list = [...top, ...above, ...below].map((data) => {
      const server = cache.guilds.get(data.guildID);
      return `${server?.name ||
        data.guildID} **[${data.channelID}]** \`${data.count}\` **(${
        Math.abs(data.count - current.count)
      })**`;
    });

    const responses = botCache.helpers.chunkStrings(list);

    for (const response of responses) {
      sendMessage(message.channelID, response);
    }
  },
});
