import { botCache } from "../../mod.ts";

botCache.eventHandlers.messageDelete = async function (message) {
  // Update stats in cache
  botCache.stats.messagesDeleted += 1;
};
