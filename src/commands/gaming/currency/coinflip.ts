import { botCache, cache, chooseRandom } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand, sendResponse } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";


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
    { name: "choice", type: "string", literals: ["heads", "tails"], defaultValue: "heads" },
    { name: "amount", type: "number", defaultValue: 1 }
  ],
  execute: async function (message, args: CommandArgs) {
    if (args.amount < 0) return botCache.helpers.reactError(message);

    const authorSettings = await db.users.get(message.author.id);
    if (!authorSettings) return botCache.helpers.reactError(message);

    // Check if author can afford
    if (amount > authorSettings.coins) return botCache.helpers.reactError(message);
  
    // Coinflip
    const coinflip = chooseRandom(["heads", "tails"]);
    const win = choice.toLowerCase() === coinflip
  
    // Add/Deduct Coins
    if (win) {
      authorSettings.coins += amount
    } else {
      authorSettings.coins -= amount
    }
  
    if (coinflip === args.choice) return botCache.helpers.reactSuccess(message);
    botCache.helpers.reactError(message);
  },
});

interface CommandArgs {
    choice: "heads" | "tails";
    amount: number;
}