import { cache } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/utils/cache.ts";
import { botCache, deleteMessageByID, Channel, Image } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

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
  execute: async function (message, args: EventsDeleteArgs) {
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
    
    const canvas = await Image.decode(customBackgroundBuffer || );

    // const canvas = new Canvas(652, 367)
    if (customBackgroundBuffer) {
      canvas
        .setGlobalAlpha(0.85)
        .save()
        .createBeveledClip(8, 0, 636, 213, 10)
        // add the image and the gradient
        .addImage(customBackgroundBuffer, 8, 0, 636, 213, { radius: 5 })
        .printLinearGradient(0, 150, 0, 0, [
          { position: 0, color: `rgba(0, 0, 0, 0.85)` },
          { position: 0.95, color: `rgba(0, 0, 0, 0)` }
        ])
        .addRect(8, 0, 636, 213)
        .restore()
    } else {
      canvas.addImage(this.Gamer.buffers.events.background, 8, 0)
    }

    canvas
      .setGlobalAlpha(1)
      .addImage(this.Gamer.buffers.events.rectangle, 0, 145)
      .addImage(this.Gamer.buffers.events.members, 34, 177)
      .addImage(this.Gamer.buffers.events.waiting, 120, 177)
      .addImage(this.Gamer.buffers.events.denials, 190, 177)
      .addImage(this.Gamer.buffers.events.clock, 260, 177)
      .setAntialiasing(`subpixel`)

      // event title
      .setTextAlign(`left`)
      .setColor(`#FFFFFF`)
      .setTextFont(`26px SFTHeavy`)
      .addMultilineText(event.title, 30, 90)

      // event author
      .setTextFont(`14px SFTHeavy`)
      .addText(`Created by ${eventAuthor?.username || `Unknown User#0000`}`, 30, 145)

      // event id
      .setTextFont(`18px SFTHeavy`)
      .setTextAlign(`center`)
      .setColor(event.backgroundURL ? `#FFFFFF` : `#4C4C4C`)
      .addResponsiveText(`#${event.eventID}`, 572, 48, 75)

      .setTextAlign(`left`)
      .setColor(`#9B9B9B`)
      .setTextFont(`16px SFTHeavy`)
      .addText(`${event.acceptedUserIDs.length} / ${event.maxAttendees}`, 65, 192)
      .addText(event.waitingList.length.toString(), 150, 192)
      .addText(event.denials.length.toString(), 220, 192)
      .setColor(`#4A4A4A`)
      .addText(this.Gamer.helpers.transform.humanizeMilliseconds(event.duration), 290, 192)
      .addText(startDate.toString(), 35, 350)
      .setTextFont(`24px SFTHeavy`)
      .addText(event.game, 35, 241)
      .setColor(`#7ED321`)
      .setTextFont(`18px SFTHeavy`)
      .addText(event.platform, 35, 261)
      .setColor(`#4C4C4C`)
      .setTextFont(`13px SFTHeavy`)

    // .addText(event.description.substring(0, 100), 35, 286)

    const platformWidth = canvas.setTextFont(`18px SFTHeavy`).measureText(event.platform)
    // @ts-ignore
    canvas.setTextFont(`13px SFTHeavy`).addText(event.activity, 15 + 35 + platformWidth.width, 261)

    if (event.showAttendees) {
      canvas.addResponsiveText(attendees.join(', ').substring(0, 95), 35, 311, 600)
    }

    if (event.isRecurring) {
      canvas
        .addImage(this.Gamer.buffers.events.recurring, 30, 29)
        .setColor(`#FFFFFF`)
        .setTextAlign(`center`)
        .setTextFont(`18px SFTHeavy`)
        .addResponsiveText(this.Gamer.helpers.transform.humanizeMilliseconds(event.frequency), 175, 50, 158)
    }
    
    botCache.helpers.reactSuccess(message);
  },
});

interface EventsDeleteArgs {
  eventID: number;
  force?: "force";
  channel?: Channel;
}

