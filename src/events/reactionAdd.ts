import { botCache } from "../../mod.ts";
import type { cache, getMessage, botID } from "../../deps.ts";

botCache.eventHandlers.reactionAdd = async function (message, emoji, userID) {
  // Update stats in cache
  botCache.stats.reactionsAddedProcessed += 1;

  // Ignore all bot reactions
  if (userID === botID) return;

  // Process reaction collectors.
  botCache.helpers.processReactionCollectors(message, emoji, userID);

  // The following require the message to be from the bot itself.
  const channel = cache.channels.get(message.channelID);
  if (!channel) return;

  // Convert potentially uncached to fully cached message.
  const fullMessage = cache.messages.get(message.id) ||
    await getMessage(channel, message.id).catch(() => undefined);
  if (!fullMessage) return;

  // These features require the author to be the bot
  if (fullMessage.author.id !== botID) return;

  // Process todo feature
  botCache.helpers.todoReactionHandler(fullMessage, emoji, userID);
};
