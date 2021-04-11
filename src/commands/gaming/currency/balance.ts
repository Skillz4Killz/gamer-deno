import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "balance",
  aliases: ["bal", "coins"],
  arguments: [{ type: "member", name: "member", required: false }] as const,
  cooldown: {
    seconds: 30,
    allowedUses: 6,
  },
  execute: async function (message, args) {
    const settings = await db.users.get(args.member?.id || message.author.id);
    let amount = settings?.coins || 0;

    const marriage = await db.marriages.get(args.member?.id || message.author.id);
    if (marriage && marriage.accepted) {
      const spouse = await db.users.get(marriage?.spouseID);
      if (spouse) amount += spouse.coins;
    }

    return message.reply(`${amount.toLocaleString("en-US")} ${botCache.constants.emojis.coin}`);
  },
});
