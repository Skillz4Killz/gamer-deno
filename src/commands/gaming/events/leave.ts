import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("events", {
  name: "leave",
  aliases: ["l"],
  cooldown: {
    seconds: 10,
  },
  arguments: [
    { name: "eventID", type: "number" },
  ],
  execute: async function (message, args: EventsLeaveArgs, guild) {
    const event = await db.events.findOne(
      { guildID: message.guildID, eventID: args.eventID },
    );
    if (!event) return botCache.helpers.reactError(message);

    // They are not in it so just tell them they are out
    if (
      ![
        ...event.acceptedUserIDs,
        ...event.waitingUserIDs,
        ...event.maybeUserIDs,
      ].includes(message.author.id)
    ) {
      return botCache.helpers.reactSuccess(message);
    }

    // Remove this id from the event
    const waitingUserIDs = event.waitingUserIDs.filter((id) =>
      id !== message.author.id
    );
    const acceptedUserIDs = event.acceptedUserIDs.filter((id) =>
      id !== message.author.id
    );

    // If there is space and others waiting move the next person into the event
    if (waitingUserIDs.length && acceptedUserIDs.length < event.maxAttendees) {
      const id = waitingUserIDs.shift();
      if (id) acceptedUserIDs.push(id);
    }

    botCache.helpers.reactSuccess(message);

    // Remove them from the event
    await db.events.update(event.id, {
      acceptedUserIDs,
      waitingUserIDs,
      maybeUserIDs: event.maybeUserIDs.filter((id) => id !== message.author.id),
    });

    // Trigger card again
    botCache.commands.get('events')?.subcommands?.get('card')?.execute?.(message, { eventID: args.eventID }, guild);
  },
});

interface EventsLeaveArgs {
  eventID: number;
}
