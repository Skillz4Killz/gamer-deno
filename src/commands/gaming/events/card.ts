import { botCache, cache, deleteMessageByID, Channel, Image } from "../../../../deps.ts";
import fonts from "../../../../fonts.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand, humanizeMilliseconds } from "../../../utils/helpers.ts";

const eventsBuffers = {
  background: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/background.png', import.meta.url))),
  rectangle: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/rectangle.png', import.meta.url))),
  calendar: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/calendar.png', import.meta.url))),
  gaming: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/gaming.png', import.meta.url))),
  private: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/private.png', import.meta.url))),
  recurring: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/recurring.png', import.meta.url))),
  members: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/members.png', import.meta.url))),
  waiting: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/waiting.png', import.meta.url))),
  denials: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/denials.png', import.meta.url))),
  clock: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/clock.png', import.meta.url))),
  community: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/community.png', import.meta.url))),
  tag: await Image.decode(await Deno.readFile(new URL('./../../../../assets/eventCard/tag.png', import.meta.url)))
};

const colors = {
  white: parseInt('FFFFFF', 16),
  eventID: parseInt('4C4C4C', 16),
  RSVP: parseInt('9B9B9B', 16),
  duration: parseInt('4A4A4A', 16),
  platform: parseInt('7ED321', 16)
};

createSubcommand("events", {
  name: "card",
  aliases: ["advertise", "ad"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  cooldown: {
    seconds: 10,
  },
  arguments: [
    { name: "eventID", type: "number" },
    { name: "channel", type: "guildtextchannel", required: false },
    { name: "force", type: "string", literals: ["force"], required: false }
  ],
  execute: async function (message, args: EventsCardArgs) {
    console.log('card ran')
    const event = await db.events.findOne(
      { guildID: message.guildID, eventID: args.eventID },
    );
    if (!event) return botCache.helpers.reactError(message);

    if (args.force || (args.channel && args.channel?.id === event.cardChannelID)) {
        deleteMessageByID(event.cardChannelID, event.cardMessageID).catch(() =>
          undefined
        );
    }

    const eventAuthor = await botCache.helpers.fetchMember(message.guildID, event.userID)

    const customBackgroundBuffer = event.backgroundURL
      ? await fetch(event.backgroundURL).then(res => res.arrayBuffer()).catch(() => undefined)
      : undefined

    const guild = cache.guilds.get(event.guildID)
    const attendees: string[] = []

    if (guild) {
      for (const id of event.acceptedUserIDs) {

        const member = await botCache.helpers.fetchMember(guild.id, id);
        if (!member) continue
  
        attendees.push(member.tag);
      }
    }
    
    const startDate = new Date(event.startsAt)
    
    const canvas = Image.new(652, 367);
    const bg = customBackgroundBuffer ? await Image.decode(customBackgroundBuffer) : eventsBuffers.background;
    const [title, username, eventID, rsvp, waiting, denials, duration, start, game, platform, activity, users, frequency] = await Promise.all([
      Image.renderText(fonts.SFTHeavy, 26, event.title, colors.white),
      Image.renderText(fonts.SFTHeavy, 14, `Created By ${eventAuthor?.tag || "Unknown User#0000"}`, colors.white),
      Image.renderText(fonts.SFTHeavy, 18, `#${event.eventID}`, event.backgroundURL ? colors.white : colors.eventID),
      Image.renderText(fonts.SFTHeavy, 16, `${event.acceptedUserIDs.length} / ${event.maxAttendees}`, colors.RSVP),
      Image.renderText(fonts.SFTHeavy, 16, event.waitingUserIDs.length.toString(), colors.RSVP),
      Image.renderText(fonts.SFTHeavy, 16, event.deniedUserIDs.length.toString(), colors.RSVP),
      Image.renderText(fonts.SFTHeavy, 16, humanizeMilliseconds(event.duration), colors.duration),
      Image.renderText(fonts.SFTHeavy, 18, startDate.toString(), colors.duration),
      Image.renderText(fonts.SFTHeavy, 24, event.game, colors.duration),
      Image.renderText(fonts.SFTHeavy, 18, event.platform, colors.platform),
      Image.renderText(fonts.SFTHeavy, 13, event.activity, colors.eventID),
      Image.renderText(fonts.SFTHeavy, 13, attendees.join(', ').substring(0, 95), colors.eventID),
      Image.renderText(fonts.SFTHeavy, 18, humanizeMilliseconds(event.frequency), colors.white),
    ]); 

    // const platformWidth = canvas.setTextFont(`18px SFTHeavy`).measureText(event.platform);

    canvas.composite(bg, 8, 0);
    canvas.composite(eventsBuffers.rectangle, 0, 145);
    canvas.composite(eventsBuffers.members, 34, 177);
    canvas.composite(eventsBuffers.waiting, 120, 177);
    canvas.composite(eventsBuffers.denials, 190, 177);
    canvas.composite(eventsBuffers.clock, 260, 177);
    canvas.composite(title, 30, 90);
    canvas.composite(username, 30, 145);
    canvas.composite(eventID, 572, 48);
    canvas.composite(rsvp, 65, 192);
    canvas.composite(waiting, 150, 192);
    canvas.composite(denials, 220, 192);
    canvas.composite(duration, 290, 192);
    canvas.composite(start, 35, 350);
    canvas.composite(game, 35, 241);
    canvas.composite(platform, 35, 261);

    // TODO: The second 50 should be platformWidth
    canvas.composite(activity, 50 + platform.width, 261);
    canvas.composite(users, 35, 311);

    if (event.isRecurring) {
      canvas.composite(eventsBuffers.recurring, 30, 29);
      canvas.composite(frequency, 175, 50);
    }

    botCache.helpers.reactSuccess(message);
  },
});

interface EventsCardArgs {
  eventID: number;
  force?: "force";
  channel?: Channel;
}

