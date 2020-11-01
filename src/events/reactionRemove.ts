import { botID, cache, getMessage } from "../../deps.ts";
import { botCache } from "../../cache.ts";

botCache.eventHandlers.reactionRemove = async function (
  message,
  emoji,
  userID,
) {
  // Check if this user is blacklisted. Check if this guild is blacklisted
  if (botCache.blacklistedIDs.has(userID) || botCache.blacklistedIDs.has(message.guildID)) return;
  
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
