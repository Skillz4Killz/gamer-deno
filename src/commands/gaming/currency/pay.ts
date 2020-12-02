import { botCache, Member } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "pay",
  arguments: [
    { name: "member", type: "member" },
    { name: "amount", type: "number" },
  ] as const,
  cooldown: {
    seconds: 30,
    allowedUses: 6,
  },
  execute: async function (message, args) {
    if (
      args.amount < 1 ||
      args.member.id === message.author.id ||
      args.member.bot
    ) {
      return botCache.helpers.reactError(message);
    }

    const amountReceivedToday = botCache.transferLog.get(message.author.id);
    // Only VIP guilds can receive more than 1000 per day.
    if (
      amountReceivedToday && amountReceivedToday > 1000 &&
      !botCache.vipUserIDs.has(args.member.id) &&
      botCache.vipGuildIDs.has(message.guildID)
    ) {
      args.amount = 1000;
    }

    // Allow the transfer
    const settings = await db.users.get(message.author.id);
    const targetSettings = await db.users.get(args.member.id);

    // Make sure the user has enough to do the transfer
    if (!settings || settings.coins < args.amount) {
      return botCache.helpers.reactError(message);
    }

    // Transfer the coins
    db.users.update(message.author.id, { coins: settings.coins - args.amount });
    db.users.update(
      args.member.id,
      { coins: (targetSettings?.coins || 0) + args.amount },
    );

    botCache.helpers.reactSuccess(message);
  },
});
