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
    const events = await db.events.findMany({}, true);
    // If there are no events or some error happened just cancel out
    if (!events.length) return;
    // Create the timestamp for right now so we can reuse it
    const now = Date.now();

    const eventsToEnd: EventsSchema[] = [];
    const eventsToStart: EventsSchema[] = [];
    const eventsToRemind: EventsSchema[] = [];

    for (const event of events) {
      // Ignore all events that are template events
      if (event.templateName) continue;
      if (event.endsAt < now) eventsToEnd.push(event);
      else if (
        event.startsAt < now && !event.hasStarted && event.endsAt > now
      ) {
        eventsToStart.push(event);
      } else if (event.startsAt > now && !event.hasStarted) {
        eventsToRemind.push(event);
      }
    }

    for (const event of eventsToEnd) endEvent(event);
    for (const event of eventsToStart) startEvent(event);
    for (const event of eventsToRemind) remindEvent(event);
  },
});

async function endEvent(event: EventsSchema) {
  // If an event is not recurring delete it
  if (!event.isRecurring) {
    // Delete the event advertisement if it existed
    if (event.cardMessageID && event.cardChannelID) {
      deleteMessageByID(event.cardChannelID, event.cardMessageID).catch(
        console.error,
      );
    }

    // Deletes the event from the database
    return db.events.delete(event.id);
  }

  // Need to recreate a new event since it was recurring
  // Set the start time to the next available interval
  while (event.startsAt < Date.now()) event.startsAt += event.frequency;

  // Reset values
  event.endsAt = event.startsAt + event.duration;
  event.hasStarted = false;
  event.executedReminders = [];

  // If vip guild and they request clearing lists do it
  if (
    event.removeRecurringAttendees && botCache.vipGuildIDs.has(event.guildID)
  ) {
    event.acceptedUsers = [];
    event.waitingUsers = [];
    event.deniedUserIDs = [];
    event.maybeUserIDs = [];
  }

  // Save the new info
  db.events.update(event.id, event);

  // See if the events card exists
  const cardMessage = cache.messages.get(event.cardMessageID) ||
    await getMessage(event.cardChannelID, event.cardMessageID).catch(() =>
      undefined
    );
  if (!cardMessage) return;

  // If it existed, update it with new info
  botCache.commands.get("events")?.subcommands?.get("card")?.execute?.(
    cardMessage,
    { eventID: event.eventID },
  );
}

async function startEvent(event: EventsSchema) {
  const embed = new Embed()
    .setDescription(event.description)
    .setTitle(event.title)
    .addField(
      translate(event.guildID, `strings:EVENTS_SHOW_RSVP_EMOJI`),
      `${event.acceptedUsers.length} / ${event.maxAttendees}`,
    );

  if (event.cardChannelID) embed.addField("➡️", `<#${event.cardChannelID}>`);

  const guild = cache.guilds.get(event.guildID);
  if (guild) {
    const iconURL = guildIconURL(guild);
    if (iconURL) embed.setThumbnail(iconURL);
  }

  // Send dm to all users
  event.acceptedUsers.forEach((user) =>
    sendDirectMessage(user.id, { embed }).catch(console.log)
  );
  // Mark the event as has started
  db.events.update(event.id, { hasStarted: true });
  // Send a reminder message to the channel
  const reminder = await sendMessage(
    event.cardChannelID,
    {
      content: botCache.vipGuildIDs.has(event.guildID)
        ? event.alertRoleIDs.map((id) => `<@&${id}>`).join(" ")
        : "",
      embed,
    },
  );
  // Delete it after a minute
  if (reminder) {
    deleteMessage(reminder, undefined, botCache.constants.milliseconds.MINUTE)
      .catch(() => undefined);
  }
}

async function remindEvent(event: EventsSchema) {
  const now = Date.now();

  const reminder = event.reminders.find(
    (reminder) =>
      !event.executedReminders.includes(reminder) &&
      event.startsAt - now < reminder,
  );
  if (!reminder) return;

  event.executedReminders.push(reminder);
  db.events.update(event.id, event);

  const embed = new Embed()
    .setTitle(event.title)
    .setDescription(event.description)
    .setTimestamp(event.startsAt)
    .addField(
      translate(event.guildID, `strings:EVENTS_SHOW_RSVP_EMOJI`),
      `${event.acceptedUsers.length} / ${event.maxAttendees}`,
    );

  if (event.cardChannelID) embed.addField("➡️", `<#${event.cardChannelID}>`);

  const guild = cache.guilds.get(event.guildID);
  if (guild) {
    const iconURL = guildIconURL(guild);
    if (iconURL) embed.setThumbnail(iconURL);
  }

  if (event.channelReminders) {
    // Send a reminder message to the channel
    const reminder = await sendMessage(
      event.cardChannelID,
      {
        content: botCache.vipGuildIDs.has(event.guildID)
          ? event.alertRoleIDs.map((id) => `<@&${id}>`).join(" ")
          : "",
        embed,
      },
    );
    // Delete it after a minute
    if (reminder) {
      deleteMessage(reminder, undefined, botCache.constants.milliseconds.MINUTE)
        .catch(() => undefined);
    }
  }

  if (!event.dmReminders) return;

  // Send dm to all users
  event.acceptedUsers.forEach((user) =>
    sendDirectMessage(user.id, { embed }).catch(console.log)
  );
}
