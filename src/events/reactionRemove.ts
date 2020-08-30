import { botCache } from "../../mod.ts";

botCache.eventHandlers.reactionRemove = function (message, emoji, userID) {
  // Update stats in cache
  botCache.stats.reactionsRemovedProcessed += 1;
};
