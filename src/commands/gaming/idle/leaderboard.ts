import { botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";
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

    const profiles = (await db.idle.findMany({}, true)).sort((a, b) => {
      const diff = BigInt(b.currency) - BigInt(a.currency);
      if (diff === BigInt(0)) return 0;
      if (BigInt(b.currency) > BigInt(a.currency)) return 1;
      return -1;
    });

    const embed = botCache.helpers.authorEmbed(message)
      .setTitle(message.author.username)
      .setDescription(
        `**${
          botCache.helpers.cleanNumber(BigInt(users.currency).toLocaleString())
        }** 💵`,
      )
      .setFooter(translate(message.guildID, "strings:IDLE_CACHE"));

    for (const [index, profile] of profiles.entries()) {
      embed.addField(
        `${index + 1}. ${
          (cache.members.get(profile.id)?.tag || profile.id).padEnd(20, " ")
        }`,
        `**${
          botCache.helpers.cleanNumber(
            BigInt(profile.currency).toLocaleString(),
          )
        }** 💵 \`${botCache.helpers.shortNumber(profile.currency)}\``,
        true,
      );
    }

    sendEmbed(message.channelID, embed);
  },
});
