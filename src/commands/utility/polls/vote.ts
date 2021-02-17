import { cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

// TODO: add translations
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
    await message.delete().catch(console.log);

    const poll = await db.polls.get(args.id);
    if (!poll) {
      return message.send("Poll not found").then((m) => m.delete(undefined, 10000));
    }

    // MAKE SURE USER HAS REQUIRED ROLES
    const member = cache.members.get(message.author.id)?.guilds.get(message.guildID);
    if (!member?.roles.some((id) => poll.allowedRoleIDs.includes(id))) {
      return message.send("You don't have the required roles").then((m) => m.delete(undefined, 10000));
    }

    // INVALID VOTE
    if (args.vote > poll.options.length) {
      return message.send("This vote doesn't have that many options").then((m) => m.delete(undefined, 10000));
    }

    const votes = poll.votes.filter((v) => v.id === message.author.id);
    // USER HAS NOT VOTED YET SO REGISTER
    if (!votes.length) {
      poll.votes.push({
        id: message.author.id,
        option: args.vote,
      });

      return message.send(translate(message.guildID, "strings:POLLS_VOTED")).then((m) => m.delete(undefined, 10000));
    }

    // USER ALREADY VOTED FOR THIS, REMOVE VOTE
    if (votes.some((v) => v.option === args.vote)) {
      // Remove votes for this user and option from db
      await db.polls.update(poll.id, {
        votes: poll.votes.filter((v) => v.id === message.author.id && v.option === args.vote),
      });
      // Tell use its done
      return message
        .send(translate(message.guildID, "strings:POLLS_VOTE_REMOVED"))
        .then((m) => m.delete(undefined, 10000));
    }

    // CHECK IF THE USER HAS MAX VOTES

    if (poll.maxVotes <= votes.length) {
      return message
        .send(translate(message.guildID, "strings:POLLS_MAX_VOTES"))
        .then((m) => m.delete(undefined, 10000));
    }

    // REGISTER THIS VOTE
    await db.polls.update(poll.id, {
      votes: [...poll.votes, { id: message.author.id, option: args.vote }],
    });
    return message.send(translate(message.guildID, "strings:POLLS_VOTED")).then((m) => m.delete(undefined, 10000));
  },
});
