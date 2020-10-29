import { botCache } from "../../cache.ts";

botCache.eventHandlers.messageDelete = async function (message) {
  // Update stats in cache
  botCache.stats.messagesDeleted += 1;
};
