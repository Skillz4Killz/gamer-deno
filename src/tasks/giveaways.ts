import { botCache, chooseRandom, sendMessage, cache, delay } from "../../deps.ts";
import { db } from "../database/database.ts";
import { GiveawaySchema } from "../database/schemas.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";

/** The giveaways ids that are currently being processed incase the pick interval is wrong we dont want it to run multiple times. */
const processingGiveaways = new Set<string>();

botCache.tasks.set("giveaways", {
  name: "giveaways",
  interval: botCache.constants.milliseconds.MINUTE * 2,
  execute: async function () {
    const giveaways = await db.giveaways.findMany({}, true);

    const now = Date.now();

    giveaways.forEach((giveaway) => {
      // If this giveaway is already being processed skip
      if (processingGiveaways.has(giveaway.id)) return;

      // These giveaway have not yet started
      if (!giveaway.hasStarted) {
        // Not time yet to start this giveaway
        if (now > giveaway.createdAt + giveaway.delayTillStart) return;
        // This giveaway needs to start.
        return db.giveaways.update(giveaway.id, { hasStarted: true });
      }

      const endsAt = giveaway.createdAt + giveaway.delayTillStart +
        giveaway.duration;

      // These giveaway have fully ended & a day has
      if (giveaway.hasEnded) {
        // If a day has passed, delete from the database.
        if (endsAt + botCache.constants.milliseconds.DAY > now) {
          return db.giveaways.delete(giveaway.id);
        }

        // Cancel out otherwise
        return;
      }

      // These givesaways have started but not fully ended, check if it is ready to end

      // Not time yet to end the giveaway
      if (endsAt > now) return;

      processingGiveaways.add(giveaway.id);
      pickGiveawayWinners(giveaway);
    });
  },
});

export async function pickGiveawayWinners(giveaway: GiveawaySchema) {
  // Winners selection might occur with a delay so we don't delete it from the database here.
  // Once all winners are selected we will delete the db giveaway
  // All winners have been selected already delete from DB.
  if (
    giveaway.pickWinners &&
    giveaway.amountOfWinners === giveaway.pickedParticipants.length
  ) {
    db.giveaways.update(giveaway.id, { hasEnded: true });
    processingGiveaways.delete(giveaway.id);
    return sendMessage(
      giveaway.notificationsChannelID,
      `<@${giveaway.memberID}> The giveaway with ID **${giveaway.id}** has finished and all winners have been selected.`,
    );
  }

  // No one entered the giveaway
  if (!giveaway.participants.length) {
    db.giveaways.update(giveaway.id, { hasEnded: true });
    processingGiveaways.delete(giveaway.id);

    return sendMessage(
      giveaway.notificationsChannelID,
      `<@${giveaway.memberID}> The giveaway with ID **${giveaway.id}** has finished but no users participated in this giveaway so no winners have been selected.`,
    );
  }

  // Only those users that have not already been picked.
  let filteredParticipants = giveaway.participants.filter((participant) => {
    // Picking winners
    if (giveaway.pickWinners) {
      // If user is not picked we want to keep this user. If they already won, we should not pick them again
      return !giveaway.pickedParticipants.some((pp) =>
        pp.memberID === participant.memberID
      );
    }

    // Picking losers. Allow same users to be picked again for multiple entries as this is HYPE mode.
    return !giveaway.pickedParticipants.some(
      (pp) =>
        pp.memberID === participant.memberID &&
        pp.joinedAt === participant.joinedAt,
    );
  });

  // If vip guild, fetch all members
  if (botCache.vipGuildIDs.has(giveaway.guildID)) {
    // Removes any users who are no longer members
    filteredParticipants = filteredParticipants.filter((participant) =>
      cache.members.get(participant.memberID)?.guilds.has(giveaway.guildID)
    );
  }

  // All losers have been picked. Only ones left are winners.
  if (
    !giveaway.pickWinners &&
    filteredParticipants.length <= giveaway.amountOfWinners
  ) {
    for (const participant of filteredParticipants) {
      const embed = new Embed()
        .setTitle(`Won the giveaway!`)
        .setDescription(`<@${participant.memberID}> has won the giveaway!`)
        .setTimestamp();

      sendEmbed(
        giveaway.notificationsChannelID,
        embed,
        `<@${participant.memberID}>`,
      );

      // If VIP guild enabled the interval option, delay it for that time period
      if (botCache.vipGuildIDs.has(giveaway.guildID) && giveaway.pickInterval) {
        await delay(giveaway.pickInterval);
        continue;
      }
    }

    sendMessage(
      giveaway.notificationsChannelID,
      `<@${giveaway.memberID}> The giveaway with ID **${giveaway.id}** has finished and all winners have been selected.`,
    );
    processingGiveaways.delete(giveaway.id);
    return db.giveaways.update(giveaway.id, { hasEnded: true });
  }

  // No participants remain to be selected.
  if (!filteredParticipants.length) {
    sendMessage(
      giveaway.notificationsChannelID,
      `<@${giveaway.memberID}> The giveaway with ID **${giveaway.id}** did not have enough users to pick all the requested winners.`,
    );

    processingGiveaways.delete(giveaway.id);
    return db.giveaways.update(giveaway.id, { hasEnded: true });
  }

  const randomParticipant = chooseRandom(filteredParticipants);
  if (!randomParticipant) return;

  // Await this to make sure it is marked as a winner before alerting the user.
  await db.giveaways.update(
    giveaway.id,
    { pickedParticipants: [...giveaway.pickedParticipants, randomParticipant] },
  );

  const embed = new Embed()
    .setTitle(`Won the giveaway!`)
    .setDescription(`<@${randomParticipant.memberID}> has won the giveaway!`)
    .setTimestamp();

  // Send message based on winner or loser
  if (giveaway.pickWinners) {
    sendEmbed(
      giveaway.notificationsChannelID,
      embed,
      `<@${randomParticipant.memberID}>`,
    );
  } else {
    embed
      .setTitle(`Lost the giveaway!`)
      .setDescription(
        `<@${randomParticipant.memberID}> has lost the giveaway!`,
      );
    sendEmbed(giveaway.notificationsChannelID, embed);
  }

  // If VIP guild enabled the interval option, delay it for that time period
  setTimeout(
    () => pickGiveawayWinners(giveaway),
    botCache.vipGuildIDs.has(giveaway.guildID) && giveaway.pickInterval
      ? giveaway.pickInterval
      : 1000,
  );
}
