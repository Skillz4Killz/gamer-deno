import { botID, cache, getMessage } from "../../deps.ts";
import { botCache } from "../../mod.ts";

botCache.eventHandlers.reactionRemove = async function (
  message,
  emoji,
  userID,
) {
  // Update stats in cache
  botCache.stats.reactionsRemovedProcessed += 1;

  // Ignore all bot reactions
  if (userID === botID) return;

  // Convert potentially uncaached to fully cached message.
  const fullMessage = cache.messages.get(message.id) ||
    await getMessage(message.channelID, message.id).catch(() => undefined);
  if (!fullMessage) return;

  // These features require the author to be the bot
  if (fullMessage.author.id !== botID) return;

  botCache.helpers.removeFeedbackReaction(fullMessage, emoji, userID);
};
