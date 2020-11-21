import { configs } from "../../../../configs.ts";
import { botCache, cache, deleteMessageByID } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { EventsSchema } from "../../../database/schemas.ts";
import {
  createSubcommand,
  sendEmbed,
  stringToMilliseconds,
} from "../../../utils/helpers.ts";
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
    const event: EventsSchema = await Gamer.helpers.events.createNewEvent(
      message,
      args.template,
      settings,
    );
    if (!event) return botCache.helpers.reactError(message);

    // Let the user know it succeeded
    botCache.helpers.reactSuccess(message);

    const prefix = botCache.guildPrefixes.get(message.guildID) ||
      configs.prefix;

    const embed = botCache.helpers.authorEmbed(message).setDescription(
      [].join("\n"),
    );
    const helperMessage = await sendEmbed(message.channelID, embed);

    let cancel = false;
    const CANCEL_OPTIONS = translate(
      message.guildID,
      `srings:CANCEL_OPTIONS`,
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

        const roleID = response.mentionRoles[0] || value;
        const role = guild.roles.get(response.mentionRoles[0] || value) ||
          guild.roles.find((r) => r.name.toLowerCase() === text);

        const text = fullValue.join(" ");

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
              event.acceptedUserIDs.length < maxAttendees &&
              event.waitingUserIDs.length
            ) {
              // Transfer user
              event.acceptedUserIDs.push(event.waitingUserIDs.shift()!);
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
      }
    }

    // Save the event

    db.events.create(message.id, event);

    // TODO: advertise card now
  },
});

interface EventsCreateArgs {
  template?: string;
}
