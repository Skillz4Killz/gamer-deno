import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("surveys", {
  name: "delete",
  aliases: ["d"],
  arguments: [{ name: "name", type: "string", lowercase: true }],
  cooldown: {
    seconds: 30,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  execute: async function (message, args) {
    await db.surveys.delete(`${message.guildID}-${args.name}`);
    return botCache.helpers.reactSuccess(message);
  },
});
