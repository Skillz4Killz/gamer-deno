import { botCache } from "../../mod.ts";

botCache.eventHandlers.messageUpdate = async function (message) {
  // Update stats in cache
  botCache.stats.messagesEdited += 1;
};
