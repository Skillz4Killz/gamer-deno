import { botCache } from "../../deps.ts";
import { db } from "../database/database.ts";

botCache.tasks.set("polls", {
  name: "polls",
  interval: botCache.constants.milliseconds.MINUTE * 2,
  execute: async function () {
    const now = Date.now();

    const polls = await db.polls.findMany((value) => value.endsAt <= now);
    if (!polls.size) return;

    polls.forEach(async (poll) => {
      // If the endsAt is 0 the poll should not expire
      if (!poll.endsAt) return;

      botCache.helpers.processPollResults(poll);
    });
  },
});
