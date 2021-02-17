import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "balance",
  aliases: ["bal", "coins"],
  cooldown: {
    seconds: 30,
    allowedUses: 6,
  },
  execute: async function (message) {
    const settings = await db.users.get(message.author.id);
    if (!settings) return botCache.helpers.reactError(message);

    let amount = settings.coins || 0;

    const marriage = await db.marriages.get(message.author.id);
    if (marriage && marriage.accepted) {
      const spouse = await db.users.get(marriage?.spouseID);
      if (spouse) amount += spouse.coins;
    }

    return message.reply(`${botCache.helpers.cleanNumber(amount)} ${botCache.constants.emojis.coin}`);
  },
});
