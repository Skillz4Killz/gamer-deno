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
import { humanizeMilliseconds, sendAlertMessage } from "../utils/helpers.ts";
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
  handleGiveawayReaction(fullMessage, emoji, userID);

  // These features require the author to be the bot
  if (fullMessage.author.id !== botID) return;

  botCache.helpers.todoReactionHandler(fullMessage, emoji, userID);
  botCache.helpers.handleFeedbackReaction(fullMessage, emoji, userID);
  handleEventReaction(fullMessage, emoji, userID);
  handlePollReaction(fullMessage, emoji, userID, "add");
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
  handleGiveawayReaction(fullMessage, emoji, userID);

  // These features require the author to be the bot
  if (fullMessage.author.id !== botID) return;

  botCache.helpers.removeFeedbackReaction(fullMessage, emoji, userID);
  handlePollReaction(fullMessage, emoji, userID, "remove");
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
    // @ts-ignore
    { eventID: event.id },
  );
}

async function handleGiveawayReaction(
  message: Message,
  emoji: ReactionPayload,
  userID: string,
) {
  // This user reacted recently and can be ignored for 2 minutes
  if (botCache.recentGiveawayReactors.has(userID)) return;
  botCache.recentGiveawayReactors.set(
    userID,
    Date.now() + botCache.constants.milliseconds.MINUTE * 2,
  );

  // When a giveaway is done, it usually gets @everyone so for that we check cache first without ddosing our db
  const giveaway = botCache.activeGiveaways.get(message.id) ||
    await db.giveaways.get(message.id);
  if (!giveaway) return;

  botCache.activeGiveaways.set(message.id, giveaway);

  const fullEmoji = botCache.helpers.emojiUnicode(emoji);
  if (giveaway.emoji !== fullEmoji) return;

  // This giveaway has ended.
  if (giveaway.hasEnded) {
    return sendAlertMessage(
      giveaway.notificationsChannelID,
      `<@${userID}>, this giveaway has already ended.`,
    );
  }

  // This giveaway has not yet started
  if (!giveaway.hasStarted) {
    return sendAlertMessage(
      giveaway.notificationsChannelID,
      `<@${userID}>, this giveaway has not yet started.`,
    );
  }

  // Check if the user has enough coins to enter
  if (giveaway.costToJoin) {
    const settings = await db.users.get(userID);
    if (!settings) {
      return sendAlertMessage(
        giveaway.notificationsChannelID,
        `<@${userID}>, you did not have enough coins to enter the giveaway. To get more coins, please use the **slots** or **daily** command. To check your balance, you can use the **balance** command.`,
      );
    }

    if (giveaway.costToJoin > settings.coins) {
      return sendAlertMessage(
        giveaway.notificationsChannelID,
        `<@${userID}>, you did not have enough coins to enter the giveaway. To get more coins, please use the **slots** or **daily** command. To check your balance, you can use the **balance** command.`,
      );
    } else {
      // Remove the coins from the user
      db.users.update(userID, { coins: settings.coins - giveaway.costToJoin });
    }
  }

  // Check if the user has one of the required roles.
  if (giveaway.requiredRoleIDsToJoin.length) {
    const channel = cache.channels.get(message.channelID);
    if (!channel) return;

    const member = await botCache.helpers.fetchMember(channel.guildID, userID);
    if (!member?.guilds.has(channel.guildID)) return;

    const allowed = giveaway.requiredRoleIDsToJoin.some((id) =>
      member.guilds.get(channel.guildID)?.roles.includes(id)
    );
    if (!allowed) {
      return sendAlertMessage(
        giveaway.notificationsChannelID,
        `<@${userID}>, you did not have one of the required roles to enter this giveaway.`,
      );
    }
  }

  // Handle duplicate entries
  if (!giveaway.allowDuplicates) {
    const isParticipant = giveaway.participants.some((participant) =>
      participant.memberID === userID
    );
    if (isParticipant) {
      return sendAlertMessage(
        giveaway.notificationsChannelID,
        `<@${userID}>, you are already a participant in this giveaway. You have reached the maximum amount of entries in this giveaway.`,
      );
    }
  } else if (giveaway.duplicateCooldown) {
    const relevantParticipants = giveaway.participants.filter((participant) =>
      participant.memberID === userID
    );
    const latestEntry = relevantParticipants.reduce(
      (timestamp, participant) => {
        if (timestamp > participant.joinedAt) return timestamp;
        return participant.joinedAt;
      },
      0,
    );

    const now = Date.now();
    // The user is still on cooldown to enter again
    if (giveaway.duplicateCooldown + latestEntry > now) {
      return sendAlertMessage(
        giveaway.notificationsChannelID,
        `<@${userID}>, you are not allowed to enter this giveaway again yet. Please wait another **${
          humanizeMilliseconds(
            giveaway.duplicateCooldown + latestEntry - now,
          )
        }**.`,
      );
    }
  }

  db.giveaways.update(
    message.id,
    {
      participants: [
        ...giveaway.participants,
        { memberID: userID, joinedAt: Date.now() },
      ],
    },
  );

  sendAlertMessage(
    giveaway.notificationsChannelID,
    `<@${userID}>, you have been **ADDED** to the giveaway.`,
  );
}

async function handlePollReaction(
  message: Message,
  emoji: ReactionPayload,
  userID: string,
  type: "add" | "remove",
) {
  if (
    !emoji.name || !botCache.constants.emojis.letters.includes(emoji.name)
  ) {
    return;
  }

  const channel = cache.channels.get(message.channelID);
  if (!channel) return;

  const poll = await db.polls.findOne({ messageID: message.id });
  if (!poll) return;

  const member = await botCache.helpers.fetchMember(channel.guildID, userID);
  if (!member) return;

  // REMOVING REACTION
  if (type === "remove") {
    return db.polls.update(poll.id, {
      votes: poll.votes.filter((v) =>
        v.id === userID &&
        v.option ===
          botCache.constants.emojis.letters.findIndex((l) => l === emoji.name)
      ),
    });
  }

  // ADDING REACTION

  // If the user does not have atleast 1 role of the required roles cancel
  if (
    poll.allowedRoleIDs.length &&
    !poll.allowedRoleIDs.some((roleID) =>
      member.guilds.get(channel.guildID)?.roles.includes(roleID)
    )
  ) {
    return sendAlertMessage(
      message.channelID,
      translate(channel.guildID, "strings:POLLS_MISSING_ROLE"),
    ).catch(console.error);
  }

  if (poll.votes.filter((v) => v.id === userID).length <= poll.maxVotes) {
    return db.polls.update(
      poll.id,
      {
        votes: [
          ...poll.votes,
          {
            id: userID,
            option: botCache.constants.emojis.letters.findIndex((l) =>
              l === emoji.name
            ),
          },
        ],
      },
    );
  }

  // User has already exceed max vote counts
  return sendAlertMessage(
    message.channelID,
    translate(channel.guildID, "strings:POLLS_MAX_VOTES"),
  );
}
