import { botCache } from "../../deps.ts";
import {
  analyticsMemberJoin,
  analyticsMemberLeft,
} from "../tasks/analytics.ts";

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
    const current = analyticsMemberJoin.get(id);
    analyticsMemberJoin.set(id, (current || 0) + 1);
  } else {
    const current = analyticsMemberLeft.get(id);
    analyticsMemberLeft.set(id, (current || 0) + 1);
  }
}
