import { bgBlue, bgYellow, black, botCache } from "../../deps.ts";
import { getTime } from "../utils/helpers.ts";

botCache.monitors.set("xp", {
  name: "xp",
  execute: async function (message) {
    // If a bot or in dm, no XP we want to encourage activity in servers not dms
    if (message.author.bot || !message.guildID) return;

    // DISABLED XP
    if (!botCache.xpEnabledGuildIDs.has(message.guildID)) return;

    console.log(`${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("supportactivity"))}] Started.`);

    // Update XP for the member locally
    await botCache.helpers.addLocalXP(
      message.guildID,
      message.author.id,
      botCache.guildsXPPerMessage.get(message.guildID) || 1
    );

    // Update XP for the user globally
    await botCache.helpers.addGlobalXP(
      message.author.id,
      botCache.vipUserIDs.has(message.author.id) && botCache.vipGuildIDs.has(message.guildID)
        ? 5
        : botCache.vipUserIDs.has(message.author.id)
        ? 3
        : botCache.vipGuildIDs.has(message.guildID)
        ? 2
        : 1
    );
  },
});
