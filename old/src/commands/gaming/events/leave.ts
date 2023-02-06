import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("events", {
  name: "leave",
  aliases: ["l"],
  cooldown: {
    seconds: 10,
  },
  arguments: [{ name: "eventID", type: "number" }] as const,
  execute: async function (message, args, guild) {
    const event = await db.events.findOne({
      guildID: message.guildID,
      eventID: args.eventID,
    });
    if (!event) return botCache.helpers.reactError(message);

    // They are not in it so just tell them they are out
    if (![...event.acceptedUsers, ...event.waitingUsers, ...event.maybeUserIDs].includes(message.author.id)) {
      return botCache.helpers.reactSuccess(message);
    }

    // Remove this id from the event
    const waitingUsers = event.waitingUsers.filter((user) => user.id !== message.author.id);
    const acceptedUsers = event.acceptedUsers.filter((user) => user.id !== message.author.id);

    // If there is space and others waiting move the next person into the event
    if (waitingUsers.length && acceptedUsers.length < event.maxAttendees) {
      const id = waitingUsers.shift();
      if (id) acceptedUsers.push(id);
    }

    await botCache.helpers.reactSuccess(message);

    // Remove them from the event
    await db.events.update(event.id, {
      acceptedUsers,
      waitingUsers,
      maybeUserIDs: event.maybeUserIDs.filter((id) => id !== message.author.id),
    });

    // Trigger card again
    botCache.commands.get("events")?.subcommands?.get("card")?.execute?.(
      message,
      // @ts-ignore
      { eventID: args.eventID },
      guild
    );
  },
});
