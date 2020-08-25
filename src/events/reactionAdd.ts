import { botCache } from "../../mod.ts";
import {} from "../../deps.ts";

botCache.eventHandlers.reactionAdd = function (message, emoji, userID) {
  // Process reaction collectors.
  botCache.helpers.processReactionCollectors(message, emoji, userID);
};
