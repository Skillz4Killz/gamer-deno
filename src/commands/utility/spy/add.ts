import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("spy", {
  name: "add",
  aliases: ["a"],
  vipServerOnly: true,
  arguments: [{ name: "word", type: "string", lowercase: true }] as const,
  execute: async function (message, args) {
    const records = botCache.spyRecords.get(args.word);
    const details = await db.spy.get(message.author.id);

    const set = new Set([...(details?.words || []), args.word]);

    if (!records) {
      // Set in cache
      botCache.spyRecords.set(args.word, [message.author.id]);
      // Set in db
      await db.spy.update(message.author.id, { words: [...set.values()] });
      return botCache.helpers.reactSuccess(message);
    }

    // This word was being spied on by someone atleast

    // The current user is already spying on this word
    if (records.includes(message.author.id)) {
      return botCache.helpers.reactSuccess(message);
    }

    // Add the user to the cache.
    records.push(message.author.id);
    // Set in db
    await db.spy.update(message.author.id, { words: [...set.values()] });

    return botCache.helpers.reactSuccess(message);
  },
});
