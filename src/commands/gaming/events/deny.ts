import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("events", {
  name: "deny",
  aliases: ["d"],
  cooldown: {
    seconds: 10,
  },
  arguments: [
    { name: "eventID", type: "number" },
  ],
  execute: async function (message, args: EventsDenyArgs, guild) {
    const event = await db.events.findOne(
      { guildID: message.guildID, eventID: args.eventID },
    );
    if (!event) return botCache.helpers.reactError(message);

    // They are already denied
    if (event.deniedUserIDs.includes(message.author.id)) {
      return botCache.helpers.reactSuccess(message);
    }

    // Remove this id from the event
    const waitingUserIDs = event.waitingUserIDs.filter((id) =>
      id !== message.author.id
    );
    const acceptedUserIDs = event.acceptedUserIDs.filter((id) =>
      id !== message.author.id
    );
    const maybeUserIDs = event.maybeUserIDs.filter((id) =>
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
      maybeUserIDs,
      deniedUserIDs: [...event.deniedUserIDs, message.author.id],
    });

    // Trigger card again
    return botCache.commands.get("events")?.subcommands?.get("card")?.execute?.(
      message,
      { eventID: args.eventID },
      guild,
    );
  },
});

interface EventsDenyArgs {
  eventID: number;
}
