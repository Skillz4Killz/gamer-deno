import {
  addRole,
  botCache,
  botHasPermission,
  botID,
  cache,
  delay,
  deleteMessages,
  getMember,
  getMessage,
  higherRolePosition,
  highestRole,
  Message,
  ReactionPayload,
  removeReaction,
  removeRole,
  sendMessage,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.reactionAdd = async function (message, emoji, userID) {
  // Update stats in cache
  botCache.stats.reactionsAddedProcessed += 1;

  // Check if this user is blacklisted. Check if this guild is blacklisted
  if (
    botCache.blacklistedIDs.has(userID) ||
    botCache.blacklistedIDs.has(message.guildID!)
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
  handleEventReaction(fullMessage, emoji, userID);
};

botCache.eventHandlers.reactionRemove = async function (
  message,
  emoji,
  userID,
) {
  // I dont care about dm reactions removes
  if (!message.guildID) return;

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

async function handleEventReaction(
  message: Message,
  emoji: ReactionPayload,
  userID: string,
) {
  const emojiKey = botCache.helpers.emojiUnicode(emoji);
  // Cancel if not a event reaction
  if (
    ![
      botCache.constants.emojis.success,
      botCache.constants.emojis.failure,
      botCache.constants.emojis.shrug,
    ].includes(emojiKey)
  ) {
    return;
  }

  const event = await db.events.findOne({ adMessageID: message.id });
  if (!event) return;

  const member = await botCache.helpers.fetchMember(message.guildID, userID);
  const guildMember = member?.guilds.get(message.guildID);
  if (!member || !guildMember) return;

  removeReaction(message.channelID, message.id, emojiKey);
  let finalPosition = "";

  switch (emojiKey) {
    case botCache.constants.emojis.success:
      // Leaving the event
      if (event.acceptedUsers.some((user) => user.id === userID)) {
        // Remove this id from the event
        const waitingUsers = event.waitingUsers.filter((user) =>
          user.id !== message.author.id
        );
        const acceptedUsers = event.acceptedUsers.filter((user) =>
          user.id !== message.author.id
        );

        // If there is space and others waiting move the next person into the event
        if (waitingUsers.length && acceptedUsers.length < event.maxAttendees) {
          const id = waitingUsers.shift();
          if (id) acceptedUsers.push(id);
        }

        botCache.helpers.reactSuccess(message);

        // Remove them from the event
        db.events.update(event.id, {
          acceptedUsers,
          waitingUsers,
          maybeUserIDs: event.maybeUserIDs.filter((id) =>
            id !== message.author.id
          ),
        });
        break;
      }

      // Check if this event even has space to join
      if (event.acceptedUsers.length >= event.maxAttendees) return;

      // User is joining the event
      if (botCache.vipGuildIDs.has(message.guildID)) {
        // VIPs can restrict certain users from joining
        if (
          event.allowedRoleIDs.length &&
          !event.allowedRoleIDs.some((id) => guildMember.roles.includes(id))
        ) {
          return;
        }

        // If this event has positions, time to ask the user for a position.
        if (event.positions.length) {
          const requestPosition = await sendMessage(
            message.channelID,
            translate(
              message.guildID,
              "strings:EVENT_PICK_POSITION",
              {
                positions: event.positions.map((p) =>
                  `**${p.name}** (${p.amount})`
                ),
              },
            ),
          );
          const positionResponse = await botCache.helpers.needMessage(
            userID,
            message.channelID,
          );
          // Validate this position
          const position = event.positions.find((p) =>
            p.name.toLowerCase() === positionResponse.content.toLowerCase()
          );
          // Make sure there is enough space in this position
          if (
            !position ||
            position.amount <=
              event.acceptedUsers.filter((user) =>
                user.position === position.name
              ).length
          ) {
            botCache.helpers.reactError(positionResponse);
            // Delete both messages to keep it clean
            await delay(2000);
            return deleteMessages(
              message.channelID,
              [requestPosition.id, positionResponse.id],
            ).catch(console.log);
          }

          finalPosition = position.name;
        }
      }

      // Allow the user to join
      db.events.update(
        event.id,
        {
          acceptedUsers: [
            ...event.acceptedUsers,
            { id: userID, position: finalPosition },
          ],
          deniedUserIDs: event.deniedUserIDs.filter((id) => id !== userID),
        },
      );
      break;
    case botCache.constants.emojis.failure:
      // User is already denied
      if (event.deniedUserIDs.includes(userID)) return;
      db.events.update(
        event.id,
        {
          acceptedUsers: event.acceptedUsers.filter((user) =>
            user.id !== userID
          ),
          deniedUserIDs: [...event.deniedUserIDs, userID],
        },
      );
      break;
    case botCache.constants.emojis.shrug:
      if (event.maybeUserIDs.includes(userID)) return;
      // User has already joined so ignore this
      db.events.update(
        event.id,
        {
          acceptedUsers: event.acceptedUsers.filter((user) =>
            user.id !== userID
          ),
          deniedUserIDs: event.deniedUserIDs.filter((id) => id !== userID),
          maybeUserIDs: [...event.maybeUserIDs, userID],
        },
      );
      break;
  }

  // Trigger the card
  botCache.commands.get("events")?.subcommands?.get("card")?.execute?.(
    message,
    { eventID: event.id },
  );
}
