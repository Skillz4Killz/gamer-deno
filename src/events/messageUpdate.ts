import { botCache } from "../../cache.ts";

botCache.eventHandlers.messageUpdate = async function (message) {
  // Update stats in cache
  botCache.stats.messagesEdited += 1;
};
