import { botCache, Collection } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";

botCache.helpers.processPollResults = async function (poll) {
  const results = new Collection(poll.options.map((o, index) => [index, 0]));
  const userVoteCount = new Map<string, number>();
  let totalVotes = 0;

  for (const vote of poll.votes) {
    const emoji = botCache.constants.emojis.letters[vote.option];
    if (!emoji) continue;

    const user = await botCache.helpers.fetchMember(poll.guildID, vote.id);
    if (!user) continue;

    const currentVotes = userVoteCount.get(vote.id);
    if (currentVotes && currentVotes + 1 > poll.maxVotes) continue;

    userVoteCount.set(vote.id, currentVotes ? currentVotes + 1 : 1);
    const current = results.get(vote.option) || 0;

    results.set(vote.option, current + 1);
    totalVotes++;
  }

  // Delete the poll in the db
  await db.polls.delete(poll.id);
  botCache.pollMessageIDs.delete(poll.id);

  const embed = new Embed()
    .setTitle(poll.question)
    .setDescription(
      results
        .map(
          (result, key) =>
            `${botCache.constants.emojis.letters[key]} ${result} | ${Math.round((result / (totalVotes || 1)) * 100)}%`
        )
        .join("\n")
    )
    .setTimestamp();

  const pollEmbed = new Embed()
    .setTitle(poll.question)
    .setDescription(poll.options.map((opt, index) => `${botCache.constants.emojis.letters[index]} ${opt}`).join("\n"));

  await sendEmbed(poll.resultsChannelID, pollEmbed)?.catch(console.log);
  await sendEmbed(poll.resultsChannelID, embed)?.catch(console.log);
};
