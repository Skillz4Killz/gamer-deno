import { botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("events", {
  name: "join",
  aliases: ["j"],
  cooldown: {
    seconds: 10,
  },
  arguments: [
    { name: "eventID", type: "number" },
  ],
  execute: async function (message, args: EventsDenyArgs) {
    const event = await db.events.findOne(
      { guildID: message.guildID, eventID: args.eventID },
    );
    if (!event) return botCache.helpers.reactError(message);

    // They are already joined
    if (event.acceptedUserIDs.includes(message.author.id)) {
      return botCache.helpers.reactSuccess(message);
    }

    // Check if the user has permission to join this event
    const member = cache.members.get(message.author.id)?.guilds.get(
      message.guildID,
    );
    if (!member) return botCache.helpers.reactError(message);

    const hasPermission = event.allowedRoleIDs.length
      ? member.roles.some((roleID) => event.allowedRoleIDs.includes(roleID))
      : true;
    if (!hasPermission) return botCache.helpers.reactError(message);

    // If there is space to join
    if (event.maxAttendees > event.acceptedUserIDs.length) {
      // Remove this id from the event
      const waitingUserIDs = event.waitingUserIDs.filter((id) =>
        id !== message.author.id
      );
      const acceptedUserIDs = [...event.acceptedUserIDs, message.author.id];
      const maybeUserIDs = event.maybeUserIDs.filter((id) =>
        id !== message.author.id
      );
      const deniedUserIDs = event.deniedUserIDs.filter((id) =>
        id !== message.author.id
      );

      botCache.helpers.reactSuccess(message);

      // Remove them from the event
      await db.events.update(event.id, {
        acceptedUserIDs,
        waitingUserIDs,
        maybeUserIDs,
        deniedUserIDs,
      });

      // TODO: Trigger card again
      return;
    }

    // There is no space and user is already waiting
    if (event.waitingUserIDs.includes(message.author.id)) {
      return botCache.helpers.reactError(message);
    }

    // Add user to waiting list
    const waitingUserIDs = [...event.waitingUserIDs, message.author.id];
    const deniedUserIDs = event.deniedUserIDs.filter((id) =>
      id !== message.author.id
    );

    botCache.helpers.reactSuccess(message);

    await db.events.update(event.id, {
      waitingUserIDs,
      deniedUserIDs,
    });

    // TODO: Trigger card again
  },
});

interface EventsDenyArgs {
  eventID: number;
}
