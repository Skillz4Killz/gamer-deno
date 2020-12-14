import { sendMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/handlers/channel.ts";
import { botCache } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";

botCache.tasks.set("reminders", {
  name: "reminders",
  interval: botCache.constants.milliseconds.MINUTE,
  execute: async function () {
    const now = Date.now();

    const reminders = await db.reminders.getAll(true);
    if (!reminders) return;

    reminders.forEach((reminder) => {
      // NOT TIME YET
      if (now < reminder.timestamp) return;
      // SEND THE REMINDER
      sendMessage(
        reminder.channelID,
        {
          content: `<@${reminder.memberID}>`,
          embed: new Embed().setDescription(reminder.content).setFooter(reminder.id),
        },
      );
      // IF NOT REPEATING, DELETE THE REMINDER
      if (!reminder.interval) {
        db.reminders.delete(reminder.id);
        return;
      }

      // RESET THE INTERVAL FOR THE NEXT TIME
      let timestamp = reminder.timestamp + reminder.interval;
      while (timestamp < now) {
        timestamp += reminder.interval;
      }

      db.reminders.update(reminder.id, { timestamp });
    });
  },
});
