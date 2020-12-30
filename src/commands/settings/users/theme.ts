import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-users", {
  name: "theme",
  aliases: ["color"],
  vipUserOnly: true,
  arguments: [
    {
      name: "text",
      type: "string",
      literals: [...botCache.constants.themes.keys()],
    },
  ] as const,
  execute: async function (message, args) {
    db.users.update(message.author.id, { theme: args.text });
    await botCache.helpers.reactSuccess(message);
  },
});
