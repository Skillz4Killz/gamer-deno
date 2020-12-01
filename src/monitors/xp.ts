import { botCache } from "../../deps.ts";

botCache.monitors.set("xp", {
  name: "xp",
  execute: function (message) {
    // If a bot or in dm, no XP we want to encourage activity in servers not dms
    if (message.author.bot || !message.guildID) return;

    // Update XP for the member locally
    botCache.helpers.addLocalXP(
      message.guildID,
      message.author.id,
      botCache.guildsXPPerMessage.get(message.guildID) || 1,
    );

    // Update XP for the user globally
    botCache.helpers.addGlobalXP(
      message.author.id,
      botCache.vipUserIDs.has(message.author.id) &&
        botCache.vipGuildIDs.has(message.guildID)
        ? 5
        : botCache.vipUserIDs.has(message.author.id)
        ? 3
        : botCache.vipGuildIDs.has(message.guildID)
        ? 2
        : 1,
    );
  },
});
