import { botCache, cache, chooseRandom, delay, sendMessage } from "../../deps.ts";
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
    const giveaways = await db.giveaways.getAll(true);

    const now = Date.now();

    giveaways.forEach(async (giveaway) => {
      // If this giveaway is already being processed skip
      if (processingGiveaways.has(giveaway.id)) return;

      // These giveaway have not yet started
      if (!giveaway.hasStarted) {
        // Not time yet to start this giveaway
        if (now > giveaway.createdAt + giveaway.delayTillStart) return;
        // This giveaway needs to start.
        return db.giveaways.update(giveaway.id, { hasStarted: true });
      }

      const endsAt = giveaway.createdAt + giveaway.delayTillStart + giveaway.duration;

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
      await pickGiveawayWinners(giveaway);
    });
  },
});

// TODO: translate this stuff
export async function pickGiveawayWinners(giveaway: GiveawaySchema) {
  // Winners selection might occur with a delay so we don't delete it from the database here.
  // Once all winners are selected we will delete the db giveaway
  // All winners have been selected already delete from DB.
  if (giveaway.pickWinners && giveaway.amountOfWinners === giveaway.pickedParticipants.length) {
    await db.giveaways.update(giveaway.id, { hasEnded: true });
    botCache.giveawayMessageIDs.delete(giveaway.id);
    processingGiveaways.delete(giveaway.id);

    return sendMessage(
      giveaway.notificationsChannelID,
      `<@${giveaway.memberID}> The giveaway with ID **${giveaway.id}** has finished and all winners have been selected.`
    ).catch(console.log);
  }

  // No one entered the giveaway
  if (!giveaway.participants.length) {
    await db.giveaways.update(giveaway.id, { hasEnded: true });
    botCache.giveawayMessageIDs.delete(giveaway.id);
    processingGiveaways.delete(giveaway.id);

    return sendMessage(
      giveaway.notificationsChannelID,
      `<@${giveaway.memberID}> The giveaway with ID **${giveaway.id}** has finished but no users participated in this giveaway so no winners have been selected.`
    ).catch(console.log);
  }

  // Only those users that have not already been picked.
  let filteredParticipants = giveaway.participants.filter((participant) => {
    // Picking winners
    if (giveaway.pickWinners) {
      // If user is not picked we want to keep this user. If they already won, we should not pick them again
      return !giveaway.pickedParticipants.some((pp) => pp.memberID === participant.memberID);
    }

    // Picking losers. Allow same users to be picked again for multiple entries as this is HYPE mode.
    return !giveaway.pickedParticipants.some(
      (pp) => pp.memberID === participant.memberID && pp.joinedAt === participant.joinedAt
    );
  });

  // If vip guild, fetch all members
  if (botCache.vipGuildIDs.has(giveaway.guildID)) {
    // Removes any users who are no longer members
    filteredParticipants = filteredParticipants.filter((participant) =>
      cache.members.get(participant.memberID)?.guilds.has(giveaway.guildID)
    );
  }

  const embed = new Embed();

  // All losers have been picked. Only ones left are winners.
  if (!giveaway.pickWinners && filteredParticipants.length <= giveaway.amountOfWinners) {
    for (const participant of filteredParticipants) {
      embed
        .setTitle(`Won the giveaway!`)
        .setDescription(`<@${participant.memberID}> has won the giveaway!`)
        .setTimestamp();

      await sendEmbed(giveaway.notificationsChannelID, embed, `<@${participant.memberID}>`);

      // If VIP guild enabled the interval option, delay it for that time period
      if (botCache.vipGuildIDs.has(giveaway.guildID) && giveaway.pickInterval) {
        await delay(giveaway.pickInterval);
        continue;
      }
    }

    await sendMessage(
      giveaway.notificationsChannelID,
      `<@${giveaway.memberID}> The giveaway with ID **${giveaway.id}** has finished and all winners have been selected.`
    ).catch(console.log);

    processingGiveaways.delete(giveaway.id);
    db.giveaways.update(giveaway.id, { hasEnded: true });
    return botCache.giveawayMessageIDs.delete(giveaway.id);
  }

  // No participants remain to be selected.
  if (!filteredParticipants.length) {
    await sendMessage(
      giveaway.notificationsChannelID,
      `<@${giveaway.memberID}> The giveaway with ID **${giveaway.id}** did not have enough users to pick all the requested winners.`
    ).catch(console.log);

    processingGiveaways.delete(giveaway.id);
    db.giveaways.update(giveaway.id, { hasEnded: true });
    return botCache.giveawayMessageIDs.delete(giveaway.id);
  }

  const randomParticipant = chooseRandom(filteredParticipants);
  if (!randomParticipant) return;

  // Await this to make sure it is marked as a winner before alerting the user.
  giveaway.pickedParticipants = [...giveaway.pickedParticipants, randomParticipant];
  await db.giveaways.update(giveaway.id, {
    pickedParticipants: giveaway.pickedParticipants,
  });

  // Send message based on winner or loser
  if (giveaway.pickWinners) {
    embed
      .setTitle(`Won the giveaway!`)
      .setDescription(`<@${randomParticipant.memberID}> has won the giveaway!`)
      .setTimestamp();
    await sendEmbed(giveaway.notificationsChannelID, embed, `<@${randomParticipant.memberID}>`);
  } else {
    embed.setTitle(`Lost the giveaway!`).setDescription(`<@${randomParticipant.memberID}> has lost the giveaway!`);
    await sendEmbed(giveaway.notificationsChannelID, embed);
  }

  // If VIP guild enabled the interval option, delay it for that time period
  setTimeout(
    () => pickGiveawayWinners(giveaway),
    botCache.vipGuildIDs.has(giveaway.guildID) && giveaway.pickInterval ? giveaway.pickInterval : 1000
  );
}
