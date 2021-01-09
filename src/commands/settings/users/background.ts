import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-users", {
  name: "background",
  aliases: ["bg"],
  vipUserOnly: true,
  arguments: [
    { name: "text", type: "string" },
  ] as const,
  execute: async function (message, args) {
    await db.users.update(message.author.id, { backgroundURL: args.text });
    await botCache.helpers.reactSuccess(message);
  },
});
