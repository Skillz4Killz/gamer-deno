import { botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("idle", {
  name: "leaderboard",
  aliases: ["leaderboards", "lb"],
  cooldown: {
    seconds: 120,
  },
  execute: async function (message) {
    const users = await db.idle.get(message.author.id);
    if (!users) return botCache.helpers.reactError(message);

    botCache.constants.idle.engine.calculateTotalProfit;

    const profiles = await db.idle.findMany({}, true);
    const leaders = profiles
      .sort((a, b) => {
        const first = botCache.constants.idle.engine.calculateTotalProfit(a);
        const second = botCache.constants.idle.engine.calculateTotalProfit(b);
        if (first === second) return 0;
        if (second > first) return 1;
        return -1;
      })
      .slice(0, 10);

    const texts = [
      `**${botCache.helpers.cleanNumber(BigInt(users.currency).toLocaleString())}** 💵 \`${botCache.helpers.shortNumber(
        botCache.constants.idle.engine.calculateTotalProfit(users)
      )}/s\` 💵`,
      "",
    ];

    for (const [index, profile] of leaders.entries()) {
      const profit = botCache.constants.idle.engine.calculateTotalProfit(profile);

      texts.push(
        `${index + 1}. ${(cache.members.get(profile.id)?.tag || profile.id).padEnd(
          20,
          " "
        )} **${botCache.helpers.shortNumber(profile.currency)}**💵  \`${botCache.helpers.shortNumber(profit)}/s\` 💵`
      );
    }

    const embed = botCache.helpers
      .authorEmbed(message)
      .setTitle(message.author.username)
      .setDescription(texts.join("\n"))
      .setFooter(translate(message.guildID, "strings:IDLE_CACHE"));

    return message.send({ embed });
  },
});
