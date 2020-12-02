import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-users", {
  name: "marriage",
  aliases: ["m"],
  vipUserOnly: true,
  arguments: [
    { name: "enabled", type: "boolean" },
  ] as const,
  execute: function (message, args) {
    db.users.update(message.author.id, { showMarriage: args.enabled });
    botCache.helpers.reactSuccess(message);
  },
});
