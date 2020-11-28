import {
  getMessage,
  sendMessage,
} from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/handlers/channel.ts";
import { editMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/handlers/message.ts";
import {
  botCache,
  cache,
  Channel,
  deleteMessageByID,
  Image,
} from "../../../../deps.ts";
import fonts from "../../../../fonts.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import {
  createSubcommand,
  humanizeMilliseconds,
} from "../../../utils/helpers.ts";

const eventsBuffers = {
  background: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/background.png", import.meta.url),
    ),
  ),
  rectangle: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/rectangle.png", import.meta.url),
    ),
  ),
  calendar: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/calendar.png", import.meta.url),
    ),
  ),
  gaming: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/gaming.png", import.meta.url),
    ),
  ),
  private: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/private.png", import.meta.url),
    ),
  ),
  recurring: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/recurring.png", import.meta.url),
    ),
  ),
  members: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/members.png", import.meta.url),
    ),
  ),
  waiting: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/waiting.png", import.meta.url),
    ),
  ),
  denials: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/denials.png", import.meta.url),
    ),
  ),
  clock: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/clock.png", import.meta.url),
    ),
  ),
  community: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/community.png", import.meta.url),
    ),
  ),
  tag: await Image.decode(
    await Deno.readFile(
      new URL("./../../../../assets/eventCard/tag.png", import.meta.url),
    ),
  ),
};

const colors = {
  // FF must always be at the end of all colors
  white: parseInt("FFFFFFFF", 16),
  eventID: parseInt("4C4C4CFF", 16),
  RSVP: parseInt("9B9B9BFF", 16),
  duration: parseInt("4A4A4AFF", 16),
  platform: parseInt("7ED321FF", 16),
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
    { name: "force", type: "string", literals: ["force"], required: false },
  ],
  execute: async function (message, args: EventsCardArgs) {
    console.log("card ran");
    const event = await db.events.findOne(
      { guildID: message.guildID, eventID: args.eventID },
    );
    if (!event) return botCache.helpers.reactError(message);
    console.log("card 1");
    const eventAuthor = await botCache.helpers.fetchMember(
      message.guildID,
      event.userID,
    );

    const customBackgroundBuffer = event.backgroundURL
      ? await fetch(event.backgroundURL).then((res) => res.arrayBuffer()).catch(
        () => undefined
      )
      : undefined;

    const guild = cache.guilds.get(event.guildID);
    const attendees: string[] = [];

    if (guild) {
      for (const user of event.acceptedUsers) {
        const member = await botCache.helpers.fetchMember(guild.id, user.id);
        if (!member) continue;

        attendees.push(member.tag);
      }
    }

    const startDate = new Date(event.startsAt);

    const canvas = Image.new(652, 367);
    const bg = customBackgroundBuffer
      ? await Image.decode(customBackgroundBuffer)
      : eventsBuffers.background;
    const [
      title,
      username,
      eventID,
      rsvp,
      waiting,
      denials,
      duration,
      start,
      game,
      platform,
      activity,
      users,
      frequency,
    ] = await Promise.all([
      Image.renderText(fonts.SFTHeavy, 26, event.title, colors.white),
      Image.renderText(
        fonts.SFTHeavy,
        14,
        `Created By ${eventAuthor?.tag || "Unknown User#0000"}`,
        colors.white,
      ),
      Image.renderText(
        fonts.SFTHeavy,
        18,
        `#${event.eventID}`,
        event.backgroundURL ? colors.white : colors.eventID,
      ),
      Image.renderText(
        fonts.SFTHeavy,
        16,
        `${event.acceptedUsers.length} / ${event.maxAttendees}`,
        colors.RSVP,
      ),
      Image.renderText(
        fonts.SFTHeavy,
        16,
        event.waitingUsers.length.toString(),
        colors.RSVP,
      ),
      Image.renderText(
        fonts.SFTHeavy,
        16,
        event.deniedUserIDs.length.toString(),
        colors.RSVP,
      ),
      Image.renderText(
        fonts.SFTHeavy,
        16,
        humanizeMilliseconds(event.duration),
        colors.duration,
      ),
      Image.renderText(
        fonts.SFTHeavy,
        18,
        startDate.toString(),
        colors.duration,
      ),
      Image.renderText(fonts.SFTHeavy, 24, event.game, colors.duration),
      Image.renderText(fonts.SFTHeavy, 18, event.platform, colors.platform),
      Image.renderText(fonts.SFTHeavy, 13, event.activity, colors.eventID),
      Image.renderText(
        fonts.SFTHeavy,
        13,
        attendees.join(", ").substring(0, 95),
        colors.eventID,
      ),
      Image.renderText(
        fonts.SFTHeavy,
        18,
        humanizeMilliseconds(event.frequency),
        colors.white,
      ),
    ]);

    canvas.composite(bg, 8, 0);
    canvas.composite(eventsBuffers.rectangle, 0, 145);
    canvas.composite(eventsBuffers.members, 34, 177);
    canvas.composite(eventsBuffers.waiting, 120, 177);
    canvas.composite(eventsBuffers.denials, 190, 177);
    canvas.composite(eventsBuffers.clock, 260, 177);
    canvas.composite(title, 30, 80);
    canvas.composite(username, 30, 135);
    canvas.composite(eventID, 559, 30);
    canvas.composite(rsvp, 65, 177);
    canvas.composite(waiting, 150, 177);
    canvas.composite(denials, 220, 177);
    canvas.composite(duration, 290, 177);
    canvas.composite(start, 35, 330);
    canvas.composite(game, 35, 231);
    canvas.composite(platform, 35, 261);
    canvas.composite(activity, 50 + platform.width, 261);
    canvas.composite(users, 35, 301);

    if (event.isRecurring) {
      canvas.composite(eventsBuffers.recurring, 30, 29);
      canvas.composite(frequency, 175, 50);
    }

    const buffer = await canvas.encode();
    const blob = new Blob([buffer], { type: 'image/png' });

    if (
      args.force || (args.channel && args.channel?.id === event.cardChannelID)
    ) {
      deleteMessageByID(event.cardChannelID, event.cardMessageID).catch(() =>
        undefined
      );
      sendMessage(
        args.channel?.id || message.channelID,
        { file: { blob, name: "event.png" } },
      );
    } else if (event.cardChannelID && event.cardMessageID) {
      const msg = cache.messages.get(event.cardMessageID) ||
        await getMessage(event.cardChannelID, event.cardMessageID).catch(() =>
          undefined
        );
      if (!msg) return botCache.helpers.reactError(message);
      editMessage(msg, { file: { blob, name: "event.png" } });
    } else {
      sendMessage(
        args.channel?.id || message.channelID,
        { file: { blob, name: "event.png" } },
      );
    }

    botCache.helpers.reactSuccess(message);
  },
});

interface EventsCardArgs {
  eventID: number;
  force?: "force";
  channel?: Channel;
}
