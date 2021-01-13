import { bgBlue, bgYellow, black, botCache, cache } from "../../deps.ts";
import { db } from "../database/database.ts";
import { getTime } from "../utils/helpers.ts";
import { sweepInactiveGuildsCache } from "./dispatchRequirements.ts";

botCache.eventHandlers.ready = async function () {
  console.info(`Loaded ${botCache.arguments.size} Argument(s)`);
  console.info(`Loaded ${botCache.commands.size} Command(s)`);
  console.info(`Loaded ${Object.keys(botCache.eventHandlers).length} Event(s)`);
  console.info(`Loaded ${botCache.inhibitors.size} Inhibitor(s)`);
  console.info(`Loaded ${botCache.monitors.size} Monitor(s)`);
  console.info(`Loaded ${botCache.tasks.size} Task(s)`);

  // Special Task
  // After interval of the bot starting up, remove inactive guilds
  setInterval(() => {
    sweepInactiveGuildsCache();
  }, 1000 * 60 * 30);

  botCache.tasks.forEach(async (task) => {
    // THESE TASKS MUST RUN WHEN STARTING BOT
    if (["missions", "vipmembers"].includes(task.name)) task.execute();

    setTimeout(async () => {
      console.log(
        `${bgBlue(`[${getTime()}]`)} => [TASK: ${
          bgYellow(black(task.name))
        }] Started.`,
      );
      await task.execute();

      setInterval(async () => {
        if (!botCache.fullyReady) return;
        console.log(
          `${bgBlue(`[${getTime()}]`)} => [TASK: ${
            bgYellow(black(task.name))
          }] Started.`,
        );
        await task.execute();
      }, task.interval);
    }, Date.now() % task.interval);
  });

  botCache.fullyReady = true;

  console.log(
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`,
  );

  const events = await db.events.getAll(true);
  for (const event of events) {
    if (!cache.guilds.has(event.guildID)) {
      console.log("EVENT NOT IN GUILD", event);
      db.events.delete(event.id).catch(console.log);
    }

    if (event.cardChannelID && !cache.channels.has(event.cardChannelID)) {
      console.log("EVENT CHANNEL NOT FOUND", event);
      db.events.delete(event.id).catch(console.log);
    }
  }

  const reminders = await db.reminders.getAll(true);
  for (const reminder of reminders) {
    if (!cache.guilds.has(reminder.guildID)) {
      console.log("REMINDER NOT IN GUILD", reminder);
      db.reminders.delete(reminder.id).catch(console.log);
    }

    if (!cache.channels.has(reminder.channelID)) {
      console.log("REMINDER CHANNEL NOT FOUND", reminder);
      db.reminders.delete(reminder.id).catch(console.log);
    }
  }
};
