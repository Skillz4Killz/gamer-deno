import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { createSubcommand, sendResponse } from "../../../../utils/helpers.ts";

createSubcommand("leaderboard", {
  name: "details",
  vipServerOnly: true,
  arguments: [
    { name: "starting", type: "number", defaultValue: 0 },
  ] as const,
  execute: async function (message, args) {
    const results = (await db.xp.findMany({ guildID: message.guildID }, true))
      .sort((a, b) => b.xp - a.xp).slice(args.starting);

    const responses = botCache.helpers.chunkStrings(
      results.map((result, index) =>
        `${index + 1 + args.starting}. <@!${
          result.id.substring(result.id.indexOf("-") + 1)
        }> Total XP: ${result.xp}`
      ),
    );

    for (const response of responses) {
      await sendResponse(
        message,
        { content: response, mentions: { parse: [] } },
      );
    }
  },
});
