import {
  botCache,
  bgBlue,
  cache,
  bgYellow,
  black,
} from "../../deps.ts";
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

  botCache.tasks.forEach((task) => {
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
};
