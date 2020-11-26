import { botCache, chooseRandom } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "coinflip",
  aliases: ["cf"],
  cooldown: {
    seconds: 30,
    allowedUses: 6,
  },
  botChannelPermissions: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "USE_EXTERNAL_EMOJIS",
  ],
  arguments: [
    {
      name: "choice",
      type: "string",
      literals: ["heads", "tails"],
      defaultValue: "heads",
    },
    { name: "amount", type: "number", defaultValue: 1 },
  ],
  execute: async function (message, args: CommandArgs) {
    if (args.amount < 0) return botCache.helpers.reactError(message);
    if (args.amount > 10) args.amount = 10;

    const authorSettings = await db.users.get(message.author.id);
    if (!authorSettings) return botCache.helpers.reactError(message);

    // Check if author can afford
    if (args.amount > authorSettings.coins) {
      return botCache.helpers.reactError(message);
    }

    // Coinflip
    const coinflip = chooseRandom(["heads", "tails"]);
    const win = args.choice === coinflip;

    // Add/Deduct Coins
    if (win) {
      authorSettings.coins += args.amount;
      return botCache.helpers.reactSuccess(message);
    }

    authorSettings.coins -= args.amount;
    botCache.helpers.reactError(message);
  },
});

interface CommandArgs {
  choice: "heads" | "tails";
  amount: number;
}
