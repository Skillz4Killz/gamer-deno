import { botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { CountingSchema } from "../../../database/schemas.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

function generateLeaderboard(current: CountingSchema, data: CountingSchema[]) {
  let number = 0;
  let tempCount = 0;

  return data
    .map((data) => {
      const server = cache.guilds.get(data.guildID);

      return `${botCache.constants.emojis.numbers[number++]} ${server?.name ?? data.guildID}: **${data.count}**${
        (tempCount = Math.abs(data.count - current.count)) > 0 ? ` (${tempCount} behind)` : ""
      }`;
    })
    .join("\n");
}

createSubcommand("counting", {
  name: "leaderboard",
  aliases: ["lb", "leaderboards"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
  guildOnly: true,
  cooldown: {
    seconds: 30,
    allowedUses: 2,
  },
  execute: async function (message) {
    const leaderboards = (await db.counting.findMany({ localOnly: false }, true)).sort((a, b) => b.count - a.count);
    const index = leaderboards.findIndex((lb) => lb.guildID === message.guildID);
    // Count not find this server
    if (index < 0) return botCache.helpers.reactError(message);

    const current = leaderboards[index];
    const top = leaderboards.slice(0, 9);
    const above = index < 10 ? undefined : leaderboards.slice(index - 9, index);
    const below = index < 10 ? undefined : leaderboards.slice(index + 1, index + 9);

    const embed = new Embed().addField("Top Ten", generateLeaderboard(current, top));

    if (above?.length) {
      embed.addField("Above", generateLeaderboard(current, above));
    }

    if (below?.length) {
      embed.addField("Behind this server", generateLeaderboard(current, below));
    }

    message.send({ embed });
  },
});
