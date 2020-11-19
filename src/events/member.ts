import { botCache } from "../../deps.ts";

botCache.eventHandlers.guildMemberAdd = function (guild, member) {
  // If VIP guild, increment analytics
  vipMemberAnalytics(guild.id, true);
};

botCache.eventHandlers.guildMemberRemove = function (guild, member) {
  // If VIP guild, increment analytics
  vipMemberAnalytics(guild.id, false);
};

function vipMemberAnalytics(id: string, joinEvent = true) {
  if (!botCache.vipGuildIDs.has(id)) return;

  if (joinEvent) {
    const current = botCache.analyticsMemberJoin.get(id);
    botCache.analyticsMemberJoin.set(id, (current || 0) + 1);
  } else {
    const current = botCache.analyticsMemberLeft.get(id);
    botCache.analyticsMemberLeft.set(id, (current || 0) + 1);
  }
}
