import { createSubcommand } from "../../../utils/helpers.ts";
import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";

createSubcommand("surveys", {
  name: "delete",
  aliases: ["d"],
  arguments: [
    { name: "name", type: "string", lowercase: true },
  ],
  cooldown: {
    seconds: 30,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  execute: function (message, args) {
    db.surveys.deleteOne({
      guildID: message.guildID,
      name: args.name,
    });

    botCache.helpers.reactSuccess(message);
  },
});
