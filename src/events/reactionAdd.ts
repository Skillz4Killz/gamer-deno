import { botCache } from "../../mod.ts";

botCache.eventHandlers.reactionAdd = function (message, emoji, userID) {
  // Update stats in cache
  botCache.stats.reactionsAddedProcessed += 1;

  // Process reaction collectors.
  botCache.helpers.processReactionCollectors(message, emoji, userID);
};
