import {
  createSubcommand,
  sendEmbed,
  stringToMilliseconds,
} from "../../../utils/helpers.ts";
import { botCache, cache, deleteMessageByID } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { EventsSchema } from "../../../database/schemas.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("events", {
  name: "create",
  aliases: ["c"],
  cooldown: {
    seconds: 30,
  },
  arguments: [
    { name: "template", type: "string", lowercase: true, required: false },
  ],
  guildOnly: true,
  execute: async function (message, args: EventsCreateArgs, guild) {
    if (!guild) return;

    const settings = await db.guilds.get(message.guildID);

    const member = cache.members.get(message.author.id)?.guilds.get(
      message.guildID,
    );

    if (
      !botCache.helpers.isModOrAdmin(message, settings) &&
      (!settings?.createEventsRoleID ||
        (settings.createEventsRoleID !== message.guildID &&
          !member?.roles.includes(settings.createEventsRoleID)))
    ) {
      return;
    }

    // create new event based on input
    const template = args.template
      ? await db.events.get(args.template)
      : undefined;
    const TITLE = translate(message.guildID, `strings:EVENTS_DEFAULT_TITLE`);
    const DESCRIPTION = translate(
      message.guildID,
      `strings:EVENTS_DEFAULT_DESCRIPTION`,
    );
    const PLATFORM = translate(
      message.guildID,
      `strings:EVENTS_DEFAULT_PLATFORM`,
    );
    const GAME = translate(message.guildID, `strings:EVENTS_DEFAULT_GAME`);
    const ACTIVITY = translate(
      message.guildID,
      `strings:EVENTS_DEFAULT_ACTIVITY`,
    );

    // 1440 minutes in a day
    const startNow = (template?.minutesFromNow || 1440) * 60000 + Date.now();

    const events = await db.events.findMany({ guildID: message.guildID }, true);

    const event: EventsSchema = {
      id: message.id,
      positions: template?.positions || [],
      joinRoleIDs: template?.joinRoleIDs || [],
      maybeUserIDs: [],
      templateName: "",
      eventID: events.reduce(
        (id, e) => id > e.eventID ? id : e.eventID,
        1,
      ),
      showUTCTime: template?.showUTCTime || false,
      bannedUsersIDs: template?.bannedUsersIDs || [],
      userID: message.author.id,
      guildID: message.guildID,
      // now + X minutes
      startsAt: startNow,
      endsAt: startNow + (template?.duration || 3600000),
      duration: template?.duration || 3600000,
      acceptedUsers: [{ id: message.author.id, position: "" }],
      deniedUserIDs: [],
      waitingUsers: [],
      reminders: template?.reminders || [600000],
      executedReminders: [],
      title: template?.title || TITLE,
      description: template?.description || DESCRIPTION,
      maxAttendees: template?.maxAttendees || 5,
      hasStarted: false,
      isRecurring: template?.isRecurring || false,
      frequency: template?.frequency || 3600000,
      cardMessageID: "undefined",
      cardChannelID: settings?.eventsAdvertiseChannelID || "",
      createdAt: Date.now(),
      platform: template?.platform || PLATFORM,
      game: template?.game || GAME,
      activity: template?.activity || ACTIVITY,
      removeRecurringAttendees: template?.removeRecurringAttendees || false,
      allowedRoleIDs: template?.allowedRoleIDs || [],
      alertRoleIDs: template?.alertRoleIDs || [],
      dmReminders: template?.dmReminders || true,
      showAttendees: true,
      minutesFromNow: template?.minutesFromNow || 0,
      backgroundURL: template?.backgroundURL || "",
    };

    await db.events.create(message.id, event);

    // Let the user know it succeeded
    botCache.helpers.reactSuccess(message);

    const embed = botCache.helpers.authorEmbed(message).setDescription(
      [...Array(19).keys()].slice(1).map((number) =>
        translate(message.guildID, `strings:EVENTS_HELPER_${number}`)
      ).join("\n"),
    );
    const helperMessage = await sendEmbed(message.channelID, embed);
    console.log(
      "cmd",
      botCache.commands.get("events")?.subcommands?.get("card"),
    );
    botCache.commands.get("events")?.subcommands?.get("card")?.execute?.(
      message,
      { eventID: event.eventID },
      guild,
    );

    let cancel = false;
    const CANCEL_OPTIONS = translate(
      message.guildID,
      `strings:CANCEL_OPTIONS`,
      { returnObjects: true },
    );

    while (!cancel) {
      const response = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID,
      );
      if (
        [`q`, `quit`, ...CANCEL_OPTIONS].includes(
          response.content.toLowerCase(),
        )
      ) {
        botCache.helpers.reactSuccess(response);
        if (helperMessage) {
          deleteMessageByID(message.channelID, helperMessage.id).catch(() =>
            undefined
          );
        }

        cancel = true;
        continue;
      }

      const options = [
        `title`,
        `description`,
        `platform`,
        `game`,
        `activity`,
        `background`,
        `attendees`,
        `repeat`,
        `remove`,
        `dm`,
        `dms`,
        `showattendees`,
        `reminder`,
        `frequency`,
        `duration`,
        `start`,
        `allowedrole`,
        `alertrole`,
        `template`,
      ];

      const bulks = response.content.split("%%");
      for (const args of bulks) {
        const [type, ...fullValue] = args.split(" ");
        const [value] = fullValue;
        if (!type || !options.includes(type.toLowerCase())) {
          botCache.helpers.reactError(message);
          continue;
        }

        const text = fullValue.join(" ");
        const role = guild.roles.get(response.mentionRoles[0] || value) ||
          guild.roles.find((r) => r.name.toLowerCase() === text);

        switch (type.toLowerCase()) {
          case `title`:
            event.title = text;
            break;
          case `description`:
            event.description = text;
            break;
          case `platform`:
            event.platform = text;
            break;
          case `game`:
            event.game = text;
            break;
          case `activity`:
            event.activity = text;
            break;
          case `background`:
            if (!botCache.vipGuildIDs.has(message.guildID)) {
              botCache.helpers.reactError(message, true);
              continue;
            }

            event.backgroundURL = value;
            break;
          // deno-lint-ignore no-case-declarations
          case `attendees`:
            const maxAttendees = value ? parseInt(value, 10) : undefined;
            if (!maxAttendees) continue;

            // Since the value updated, try and update the respective users
            while (
              event.acceptedUsers.length < maxAttendees &&
              event.waitingUsers.length
            ) {
              // Transfer user
              event.acceptedUsers.push(event.waitingUsers.shift()!);
            }

            event.maxAttendees = maxAttendees;
            break;
          case `repeat`:
            event.isRecurring = !event.isRecurring;
            break;
          case `remove`:
            event.removeRecurringAttendees = !event.removeRecurringAttendees;
            break;
          case `dm`:
          case `dms`:
            event.dmReminders = !event.dmReminders;
            break;
          case `showattendees`:
            event.showAttendees = !event.showAttendees;
            break;
          // deno-lint-ignore no-case-declarations
          case `reminder`:
            const reminder = value ? stringToMilliseconds(value) : undefined;
            if (!reminder) {
              botCache.helpers.reactError(message);
              continue;
            }

            if (event.reminders.includes(reminder)) {
              event.reminders = event.reminders.filter((r) => r === reminder);
            } else event.reminders.push(reminder);
            break;
          // deno-lint-ignore no-case-declarations
          case `frequency`:
            const frequency = value ? stringToMilliseconds(value) : undefined;
            if (!frequency) {
              botCache.helpers.reactError(message);
              continue;
            }

            event.frequency = frequency;
            break;
          // deno-lint-ignore no-case-declarations
          case `duration`:
            const duration = value ? stringToMilliseconds(value) : undefined;
            if (!duration) {
              botCache.helpers.reactError(message);
              continue;
            }

            event.duration = duration;
            event.endsAt = event.startsAt + event.duration;
            break;
          // deno-lint-ignore no-case-declarations
          case `start`:
            const start = value ? stringToMilliseconds(value) : undefined;
            const startTime = new Date(text).getTime();

            if (!start && !startTime) {
              botCache.helpers.reactError(message);
              continue;
            }

            event.startsAt = start ? Date.now() + start : startTime;
            event.endsAt = event.startsAt + event.duration;
            break;
          case `allowedrole`:
            if (!role) {
              botCache.helpers.reactError(message);
              continue;
            }

            if (event.allowedRoleIDs.includes(role.id)) {
              event.allowedRoleIDs = event.allowedRoleIDs.filter((id) =>
                id !== role.id
              );
            } else event.allowedRoleIDs.push(role.id);
            break;
          case `alertrole`:
            if (!role) {
              botCache.helpers.reactError(message);
              continue;
            }

            if (event.alertRoleIDs.includes(role.id)) {
              event.alertRoleIDs = event.alertRoleIDs.filter((id) =>
                id !== role.id
              );
            } else event.alertRoleIDs.push(role.id);
            break;
          case `joinrole`:
            if (!role) {
              botCache.helpers.reactError(message);
              continue;
            }

            if (event.joinRoleIDs.includes(role.id)) {
              event.joinRoleIDs = event.joinRoleIDs.filter((id) =>
                id !== role.id
              );
            } else event.joinRoleIDs.push(role.id);
            break;
          case `template`:
            event.templateName = value;
            break;
          default:
            // If they used the command wrong show them the help
            botCache.helpers.reactError(message);
            continue;
        }

        botCache.commands.get("events")?.subcommands?.get("card")?.execute?.(
          message,
          { eventID: event.eventID },
          guild,
        );
      }
    }

    // Save the event
    db.events.update(message.id, event);

    // Trigger card again
    botCache.commands.get("events")?.subcommands?.get("card")?.execute?.(
      message,
      { eventID: event.eventID },
      guild,
    );
  },
});

interface EventsCreateArgs {
  template?: string;
}
