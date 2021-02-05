import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

// TODO: confirm?
createSubcommand("idle", {
  name: "delete",
  execute: async function (message) {
    await db.idle.delete(message.author.id);
    return botCache.helpers.reactSuccess(message);
  },
});
