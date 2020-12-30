import { botCache, cache, deleteMessage } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand, sendAlertMessage } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("polls", {
  name: "vote",
  guildOnly: true,
  arguments: [
    { name: "id", type: "snowflake" },
    { name: "vote", type: "number", minimum: 1, maximum: 20 },
  ] as const,
  vipServerOnly: true,
  execute: async function (message, args) {
    // This command is meant to be private stuff. Anonymous voting.
    await deleteMessage(message).catch(console.log);

    const poll = await db.polls.get(args.id);
    if (!poll) return botCache.helpers.reactError(message);

    // MAKE SURE USER HAS REQUIRED ROLES
    const member = cache.members.get(message.author.id)?.guilds.get(
      message.guildID,
    );
    if (
      !member?.roles.some((id) => poll.allowedRoleIDs.includes(id))
    ) {
      return botCache.helpers.reactError(message);
    }

    // INVALID VOTE
    if (args.vote > poll.options.length) {
      return botCache.helpers.reactError(message);
    }

    const votes = poll.votes.filter((v) => v.id === message.author.id);
    // USER HAS NOT VOTED YET SO REGISTER
    if (!votes.length) {
      poll.votes.push({
        id: message.author.id,
        option: args.vote,
      });

      return sendAlertMessage(
        message.channelID,
        translate(message.guildID, "strings:POLLS_VOTED"),
      );
    }

    // USER ALREADY VOTED FOR THIS, REMOVE VOTE
    if (votes.some((v) => v.option === args.vote)) {
      // Remove votes for this user and option from db
      db.polls.update(
        poll.id,
        {
          votes: poll.votes.filter((v) =>
            v.id === message.author.id && v.option === args.vote
          ),
        },
      );
      // Tell use its done
      return sendAlertMessage(
        message.channelID,
        translate(message.guildID, "strings:POLLS_VOTE_REMOVED"),
      );
    }

    // CHECK IF THE USER HAS MAX VOTES

    if (poll.maxVotes <= votes.length) {
      return sendAlertMessage(
        message.channelID,
        translate(message.guildID, "strings:POLLS_MAX_VOTES"),
      );
    }

    // REGISTER THIS VOTE
    db.polls.update(
      poll.id,
      { votes: [...poll.votes, { id: message.author.id, option: args.vote }] },
    );
    return sendAlertMessage(
      message.channelID,
      translate(message.guildID, "strings:POLLS_VOTED"),
    );
  },
});
