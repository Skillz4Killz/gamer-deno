import {
  botCache,
  cache,
  deleteMessage,
  deleteMessageByID,
  getMessage,
  guildIconURL,
  sendDirectMessage,
  sendMessage,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { EventsSchema } from "../database/schemas.ts";
import { Embed } from "../utils/Embed.ts";
import { translate } from "../utils/i18next.ts";

botCache.tasks.set("events", {
  name: "events",
  interval: botCache.constants.milliseconds.MINUTE,
  execute: async function () {
    // First fetch all the events from the database
    const events = await db.events.getAll(true);
    // If there are no events or some error happened just cancel out
    if (!events.length) return;
    // Create the timestamp for right now so we can reuse it
    const now = Date.now();

    await Promise.allSettled(
      events.map(async (event) => {
        // Ignore all events that are template events
        if (event.templateName) return;
        if (event.endsAt < now) await endEvent(event);
        else if (event.startsAt < now && !event.hasStarted && event.endsAt > now) {
          await startEvent(event);
        } else if (event.startsAt > now && !event.hasStarted) {
          await remindEvent(event);
        }
      })
    );
  },
});

async function endEvent(event: EventsSchema) {
  // If an event is not recurring delete it
  if (!event.isRecurring) {
    // Delete the event advertisement if it existed
    if (event.cardMessageID && event.cardChannelID) {
      await deleteMessageByID(event.cardChannelID, event.cardMessageID).catch(console.log);
    }

    // Deletes the event from the database
    return db.events.delete(event.id);
  }

  const now = Date.now();

  // Need to recreate a new event since it was recurring
  // Set the start time to the next available interval
  while (event.startsAt < now) event.startsAt += event.frequency;

  // Reset values
  event.endsAt = event.startsAt + event.duration;
  event.hasStarted = false;
  event.executedReminders = [];

  // If vip guild and they request clearing lists do it
  if (event.removeRecurringAttendees && botCache.vipGuildIDs.has(event.guildID)) {
    event.acceptedUsers = [];
    event.waitingUsers = [];
    event.deniedUserIDs = [];
    event.maybeUserIDs = [];
  }

  // Save the new info
  await db.events.update(event.id, event);

  // See if the events card exists
  const cardMessage = event.cardMessageID
    ? cache.messages.get(event.cardMessageID) ||
      (await getMessage(event.cardChannelID, event.cardMessageID).catch(async (error) => {
        console.log("failed and inside error", error);
        await db.events.update(event.id, { cardMessageID: undefined });
      }))
    : undefined;
  if (!cardMessage) return;

  // If it existed, update it with new info
  await botCache.commands.get("events")?.subcommands?.get("card")?.execute?.(
    cardMessage,
    // @ts-ignore
    { eventID: event.eventID }
  );
}

async function startEvent(event: EventsSchema) {
  console.log("event start ran");
  const embed = new Embed()
    .setDescription(event.description)
    .setTitle(event.title)
    .addField(
      translate(event.guildID, `strings:EVENTS_SHOW_RSVP_EMOJI`),
      `${event.acceptedUsers.length} / ${event.maxAttendees}`
    );

  if (event.cardChannelID) embed.addField("➡️", `<#${event.cardChannelID}>`);

  const guild = cache.guilds.get(event.guildID);
  if (guild) {
    const iconURL = guildIconURL(guild);
    if (iconURL) embed.setThumbnail(iconURL);
  }

  // Send dm to all users
  event.acceptedUsers.forEach(async (user) => await sendDirectMessage(user.id, { embed }).catch(console.log));
  // Mark the event as has started
  await db.events.update(event.id, { hasStarted: true });
  // Send a reminder message to the channel
  const reminder = await sendMessage(event.cardChannelID, {
    content: botCache.vipGuildIDs.has(event.guildID) ? event.alertRoleIDs.map((id) => `<@&${id}>`).join(" ") : "",
    embed,
  }).catch(console.log);
  // Delete it after a minute
  if (reminder) {
    await deleteMessage(reminder, undefined, botCache.constants.milliseconds.MINUTE).catch(console.log);
  }
}

async function remindEvent(event: EventsSchema) {
  const now = Date.now();

  const reminder = event.reminders.find(
    (reminder) => !event.executedReminders.includes(reminder) && event.startsAt - now < reminder
  );
  if (!reminder) return;

  event.executedReminders.push(reminder);
  await db.events.update(event.id, event);

  const embed = new Embed()
    .setTitle(event.title)
    .setDescription(event.description)
    .setTimestamp(event.startsAt)
    .addField(
      translate(event.guildID, `strings:EVENTS_SHOW_RSVP_EMOJI`),
      `${event.acceptedUsers.length} / ${event.maxAttendees}`
    );

  if (event.cardChannelID) embed.addField("➡️", `<#${event.cardChannelID}>`);

  const guild = cache.guilds.get(event.guildID);
  if (guild) {
    const iconURL = guildIconURL(guild);
    if (iconURL) embed.setThumbnail(iconURL);
  }

  if (event.channelReminders) {
    // Send a reminder message to the channel
    const reminder = await sendMessage(event.cardChannelID, {
      content: botCache.vipGuildIDs.has(event.guildID) ? event.alertRoleIDs.map((id) => `<@&${id}>`).join(" ") : "",
      embed,
    });
    // Delete it after a minute
    if (reminder) {
      await deleteMessage(reminder, undefined, botCache.constants.milliseconds.MINUTE).catch(console.log);
    }
  }

  if (!event.dmReminders) return;

  // Send dm to all users
  event.acceptedUsers.forEach(async (user) => await sendDirectMessage(user.id, { embed }).catch(console.log));
}
