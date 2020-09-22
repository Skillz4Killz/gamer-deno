import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("counting", {
  name: "leaderboard",
  aliases: ["lb"],
  guildOnly: true,
  cooldown: {
    seconds: 30,
    allowedUses: 2,
  },
  execute: async function (message, args, guild) {
    // const settings = await countingDatabase.findOne(
    //   { localOnly: false, guildID: message.guildID },
    // );
    // if (!settings) return botCache.helpers.reactError(message);

    // const test = countingDatabase.find(
    //   { count: { $lte: settings.count }, localOnly: { $eq: false } },
    // );

    // const [aboveTen, belowTen] = await Promise.all([
    //   countingDatabase.find(
    //     { localOnly: false, count: { $lte: settings.count } },
    //   ).limit(10).sort({ count: -1 }),
    //   countingDatabase.find(
    //     { localOnly: false, count: { $gte: settings.count } },
    //   ).limit(10).sort({ count: -1 }),
    // ]);

    // console.log("db check", aboveTen);
    console.log("-------------------");
    // console.log("db check", belowTen);
  },
});
