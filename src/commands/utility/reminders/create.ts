import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("remind", {
  name: "create",
  cooldown: {
    seconds: 120,
    allowedUses: 2,
  },
  guildOnly: true,
  arguments: [
    { name: "start", type: "duration" },
    { name: "interval", type: "duration", required: false },
    { name: "content", type: "...string" },
  ] as const,
  execute: async (message, args) => {
    await db.reminders.create(message.id, {
      id: message.id,
      reminderID: message.id,
      guildID: message.guildID,
      channelID: message.channelID,
      memberID: message.author.id,
      recurring: true,
      content: args.content,
      timestamp: message.timestamp + args.start,
      interval: args.interval,
    });

    return botCache.helpers.reactSuccess(message);
  },
});
