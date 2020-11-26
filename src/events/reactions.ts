import {
  addRole,
  botCache,
  botHasPermission,
  botID,
  cache,
  getMember,
  getMessage,
  higherRolePosition,
  highestRole,
  Message,
  ReactionPayload,
  removeRole,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.reactionAdd = async function (message, emoji, userID) {
  // Update stats in cache
  botCache.stats.reactionsAddedProcessed += 1;

  // Check if this user is blacklisted. Check if this guild is blacklisted
  if (
    botCache.blacklistedIDs.has(userID) ||
    botCache.blacklistedIDs.has(message.guildID)
  ) {
    return;
  }

  // Ignore all bot reactions
  if (userID === botID) return;

  // Process reaction collectors.
  botCache.helpers.processReactionCollectors(message, emoji, userID);

  // Convert potentially uncached to fully cached message.
  const fullMessage = cache.messages.get(message.id) ||
    await getMessage(message.channelID, message.id).catch(() => undefined);
  if (!fullMessage) return;

  // This does not require the author to be the bot
  handleReactionRole(fullMessage, emoji, userID);

  // These features require the author to be the bot
  if (fullMessage.author.id !== botID) return;

  botCache.helpers.todoReactionHandler(fullMessage, emoji, userID);
  botCache.helpers.handleFeedbackReaction(fullMessage, emoji, userID);
};

botCache.eventHandlers.reactionRemove = async function (
  message,
  emoji,
  userID,
) {
  // Check if this user is blacklisted. Check if this guild is blacklisted
  if (
    botCache.blacklistedIDs.has(userID) ||
    botCache.blacklistedIDs.has(message.guildID)
  ) {
    return;
  }

  // Update stats in cache
  botCache.stats.reactionsRemovedProcessed += 1;

  // Ignore all bot reactions
  if (userID === botID) return;

  // Convert potentially uncaached to fully cached message.
  const fullMessage = cache.messages.get(message.id) ||
    await getMessage(message.channelID, message.id).catch(() => undefined);
  if (!fullMessage) return;

  // These features dont require the author to be the bot
  handleReactionRole(fullMessage, emoji, userID);

  // These features require the author to be the bot
  if (fullMessage.author.id !== botID) return;

  botCache.helpers.removeFeedbackReaction(fullMessage, emoji, userID);
};

async function handleReactionRole(
  message: Message,
  emoji: ReactionPayload,
  userID: string,
) {
  if (!(await botHasPermission(message.guildID, ["MANAGE_ROLES"]))) return;

  const botsHighestRole = await highestRole(message.guildID, botID);
  if (!botsHighestRole) return;

  const reactionRole = await db.reactionroles.findOne(
    { messageID: message.id },
  );
  if (!reactionRole) return;

  const emojiKey = emoji.id ? botCache.helpers.emojiUnicode(emoji) : emoji.name;

  const relevantReaction = reactionRole.reactions.find((r) =>
    r.reaction.toLowerCase() === emojiKey
  );
  if (!relevantReaction) return;

  let member = cache.members.get(userID)?.guilds.get(message.guildID);
  if (!member) {
    await getMember(message.guildID, userID).catch(() => undefined);
    member = cache.members.get(userID)?.guilds.get(message.guildID);
  }

  if (!member) return;

  for (const roleID of relevantReaction.roleIDs) {
    if (
      !(await higherRolePosition(message.guildID, botsHighestRole.id, roleID))
    ) {
      continue;
    }

    if (member.roles.includes(roleID)) {
      removeRole(
        message.guildID,
        userID,
        roleID,
        translate(message.guildID, "strings:REACTION_ROLE_REMOVED"),
      );
    } else {
      addRole(
        message.guildID,
        userID,
        roleID,
        translate(message.guildID, "strings:REACTION_ROLE_ADDED"),
      );
    }
  }
}
