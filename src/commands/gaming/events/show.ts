import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand, humanizeMilliseconds, sendEmbed, sendResponse } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("events", {
    name: "show",
    aliases: ["s"],
    botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    cooldown: {
        seconds: 30,
    },
    arguments: [
        { name: "eventID", type: "number" }
    ],
    execute: async function (message, args: CommandArgs, guild) {
        const event = await db.events.findOne({ guildID: message.guildID, eventID: args.eventID });
        if (!event) return botCache.helpers.reactError(message);

        const attendees = event.acceptedUsers.map(user => `<@!${user.id}> ${user.position}`).join(' ');
        const waitingList = event.waitingUsers.map(user => `<@!${user.id}> ${user.position}`).join(' ');
        const denials = event.deniedUserIDs.map(id => `<@!${id}>`).join(' ');
        const maybes = event.maybeUserIDs.map(id => `<@!${id}>`).join(' ')

  const NONE = translate(message.guildID, `common:NONE`)
  const ENABLED = translate(message.guildID, `common:ENABLED`)
  const DISABLED = translate(message.guildID, `common:DISABLED`)

  const embed = botCache.helpers.authorEmbed(message)
    .setTitle(`[1] ${event.title}`)
    .setDescription(`**[2]** ${event.description}`)
    .addField(
      translate(message.guildID, `events/eventshow:TIME_EMOJI`),
      translate(message.guildID, `events/eventshow:TIME`, {
        duration: humanizeMilliseconds(event.duration),
        reminders: event.reminders.map(r => humanizeMilliseconds(r)).join(' ')
      })
      // Add recurring info here
    )
    .addField(
      translate(message.guildID, `events/eventshow:RSVP_EMOJI`),
      translate(message.guildID, `events/eventshow:RSVP`, {
        stats: `${event.acceptedUsers.length} / ${event.maxAttendees}`,
        attendees: attendees.length ? attendees : NONE,
        waitingList: waitingList.length ? waitingList : NONE,
        denials: denials.length ? denials : NONE
      })
    )
    .addField(
      translate(message.guildID, `events/eventshow:GAMING_EMOJI`),
      translate(message.guildID, `events/eventshow:GAMING`, { platform: event.platform, game: event.game, activity: event.activity })
    )
    .addField(
      translate(message.guildID, `events/eventshow:BASIC_EMOJI`),
      translate(message.guildID, `events/eventshow:BASIC`, {
        dm: event.dmReminders ? ENABLED : DISABLED,
        allowedRoles: event.allowedRoleIDs.length ? event.allowedRoleIDs.map(id => `<@&${id}>`).join(' ') : NONE,
        alertRoles: event.alertRoleIDs.length ? event.alertRoleIDs.map(id => `<@&${id}>`).join(' ') : NONE,
        remove: translate(message.guildID, event.removeRecurringAttendees ? 'common:ENABLED' : 'common:DISABLED')
      })
    )
    .setFooter(translate(message.guildID, `events/eventshow:STARTS_AT`))
    .setTimestamp(event.startsAt)

      sendResponse(message, { embed });
    }
})

interface CommandArgs {
    eventID: number;
}