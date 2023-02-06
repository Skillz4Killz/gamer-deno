import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "randomnumber",
  aliases: ["rn"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  execute: async function (message) {
    return message.reply("/random number");
    // return message.reply(Math.floor(Math.random() * (args.max - args.min) + args.min).toLocaleString("en-US"));
  },
});
