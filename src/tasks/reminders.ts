import { botCache, sendMessage } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";

botCache.tasks.set("reminders", {
  name: "reminders",
  interval: botCache.constants.milliseconds.MINUTE,
  execute: async function () {
    const now = Date.now();

    const reminders = await db.reminders.getAll(true);
    if (!reminders) return;

    reminders.forEach(async (reminder) => {
      // NOT TIME YET
      if (now < reminder.timestamp) return;
      // SEND THE REMINDER
      await sendMessage(
        reminder.channelID,
        {
          content: `<@${reminder.memberID}>`,
          embed: new Embed().setDescription(reminder.content).setFooter(
            reminder.id,
          ),
        },
      ).catch(console.error);
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
