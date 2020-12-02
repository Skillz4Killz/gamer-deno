import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import {
  createSubcommand,
  humanizeMilliseconds,
  sendResponse,
} from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("events", {
  name: "show",
  aliases: ["s"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  cooldown: {
    seconds: 30,
  },
  arguments: [
    { name: "eventID", type: "number" },
  ] as const,
  execute: async function (message, args) {
    const event = await db.events.findOne(
      { guildID: message.guildID, eventID: args.eventID },
    );
    if (!event) return botCache.helpers.reactError(message);

    const attendees = event.acceptedUsers.map((user) =>
      `<@!${user.id}> ${user.position}`
    ).join(" ");
    const waitingList = event.waitingUsers.map((user) =>
      `<@!${user.id}> ${user.position}`
    ).join(" ");
    const denials = event.deniedUserIDs.map((id) => `<@!${id}>`).join(" ");
    const maybes = event.maybeUserIDs.map((id) => `<@!${id}>`).join(" ");

    const NONE = translate(message.guildID, `strings:NONE`);

    const TIME_INFO = [
      translate(
        message.guildID,
        "strings:EVENTS_SHOW_TIME_1",
        { value: humanizeMilliseconds(event.duration) },
      ),
      translate(
        message.guildID,
        "strings:EVENTS_SHOW_TIME_2",
        {
          value: event.reminders.map((r) => humanizeMilliseconds(r)).join(" "),
        },
      ),
      translate(
        message.guildID,
        "strings:EVENTS_SHOW_TIME_5",
        {
          value: event.showUTCTime
            ? botCache.constants.emojis.success
            : botCache.constants.emojis.failure,
        },
      ),
      translate(
        message.guildID,
        "strings:EVENTS_SHOW_TIME_3",
        {
          value: event.isRecurring
            ? `${botCache.constants.emojis.success} ${
              humanizeMilliseconds(event.frequency)
            }`
            : botCache.constants.emojis.failure,
        },
      ),
    ];

    // Add recurring info here
    if (event.isRecurring) {
      TIME_INFO.push(
        translate(
          message.guildID,
          "strings:EVENTS_SHOW_TIME_4",
          {
            value: event.removeRecurringAttendees
              ? botCache.constants.emojis.success
              : botCache.constants.emojis.failure,
          },
        ),
      );
    }

    const embed = botCache.helpers.authorEmbed(message)
      .setTitle(
        `${event.title}`,
        event.cardMessageID && event.cardChannelID
          ? `https://discord.com/channels/${event.guildID}/${event.cardChannelID}/${event.cardMessageID}`
          : undefined,
      )
      .setDescription(`${event.description}`)
      .addField(
        translate(message.guildID, `strings:EVENTS_SHOW_TIME_EMOJI`),
        TIME_INFO.join("\n"),
      )
      .addField(
        translate(message.guildID, `strings:EVENTS_SHOW_RSVP_EMOJI`),
        [
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_RSVP_1",
            {
              value: event.showAttendees
                ? botCache.constants.emojis.success
                : botCache.constants.emojis.failure,
            },
          ),
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_RSVP_2",
            { value: event.joinRoleID ? `<@&${event.joinRoleID}>` : NONE },
          ),
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_RSVP_3",
            { value: `${event.acceptedUsers.length} / ${event.maxAttendees}` },
          ),
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_RSVP_4",
            { value: attendees.length ? attendees : NONE },
          ),
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_RSVP_5",
            { value: maybes.length ? maybes : NONE },
          ),
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_RSVP_6",
            { value: waitingList.length ? waitingList : NONE },
          ),
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_RSVP_7",
            { value: denials.length ? denials : NONE },
          ),
        ].join("\n"),
      )
      .addField(
        translate(message.guildID, `strings:EVENTS_SHOW_GAMING_EMOJI`),
        [
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_POSITIONS",
            {
              value: event.positions.map((p) =>
                `**${p.name}**: ${p.amount}`
              ).join(" ") || NONE,
            },
          ),
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_GAMING_1",
            { value: event.platform },
          ),
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_GAMING_2",
            { value: event.game },
          ),
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_GAMING_3",
            { value: event.activity },
          ),
        ].join("\n"),
      )
      .addField(
        translate(message.guildID, `strings:EVENTS_SHOW_BASIC_EMOJI`),
        [
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_BASIC_1",
            {
              value: event.dmReminders
                ? botCache.constants.emojis.success
                : botCache.constants.emojis.failure,
              value2: event.channelReminders
                ? botCache.constants.emojis.success
                : botCache.constants.emojis.failure,
            },
          ),
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_BASIC_2",
            {
              value: event.allowedRoleIDs.length
                ? event.allowedRoleIDs.map((id) => `<@&${id}>`).join(" ")
                : NONE,
            },
          ),
          translate(
            message.guildID,
            "strings:EVENTS_SHOW_BASIC_3",
            {
              value: event.alertRoleIDs.length
                ? event.alertRoleIDs.map((id) => `<@&${id}>`).join(" ")
                : NONE,
            },
          ),
        ].join("\n"),
      )
      .setFooter(translate(message.guildID, `strings:EVENTS_SHOW_STARTS_AT`))
      .setTimestamp(event.startsAt);

    if (event.backgroundURL) embed.setImage(event.backgroundURL);

    sendResponse(message, { embed });
  },
});
