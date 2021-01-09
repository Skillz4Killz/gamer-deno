import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-users", {
  name: "description",
  aliases: ["desc"],
  vipUserOnly: true,
  arguments: [
    { name: "text", type: "...string" },
  ] as const,
  execute: async function (message, args) {
    await db.users.update(message.author.id, { description: args.text });
    await botCache.helpers.reactSuccess(message);
  },
});
