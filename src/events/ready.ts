import { botCache, cache } from "../../deps.ts";
import { registerTasks } from "../utils/helpers.ts";

botCache.eventHandlers.ready = async function () {
  console.info(`Loaded ${botCache.arguments.size} Argument(s)`);
  console.info(`Loaded ${botCache.commands.size} Command(s)`);
  console.info(`Loaded ${Object.keys(botCache.eventHandlers).length} Event(s)`);
  console.info(`Loaded ${botCache.inhibitors.size} Inhibitor(s)`);
  console.info(`Loaded ${botCache.monitors.size} Monitor(s)`);
  console.info(`Loaded ${botCache.tasks.size} Task(s)`);

  botCache.tasks.forEach(async (task) => {
    // THESE TASKS MUST RUN WHEN STARTING BOT
    if (["missions", "vipmembers"].includes(task.name)) await task.execute();
  });

  registerTasks();

  botCache.fullyReady = true;

  console.log(
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`,
  );
};
