import { createSubcommand } from "../../../utils/helpers.ts";
import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";

createSubcommand("remind", {
  name: "delete",
  cooldown: {
    seconds: 120,
    allowedUses: 2,
  },
  guildOnly: true,
  arguments: [{ name: "id", type: "snowflake" }] as const,
  execute: async (message, args) => {
    const reminder = await db.reminders.get(args.id);
    if (reminder?.memberID !== message.author.id) {
      return botCache.helpers.reactError(message);
    }

    await db.reminders.delete(args.id);
    return botCache.helpers.reactSuccess(message);
  },
});
