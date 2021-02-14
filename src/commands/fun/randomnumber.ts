import { botCache } from "../../../deps.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "randomnumber",
  aliases: ["rn"],
  arguments: [
    { name: "min", type: "number", defaultValue: 0 },
    { name: "max", type: "number", defaultValue: 100 },
  ] as const,
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  vipServerOnly: true,
  execute: async function (message, args) {
    return message.reply(
      botCache.helpers.cleanNumber(
        Math.floor(Math.random() * (args.max - args.min) + args.min)
      )
    );
  },
});
