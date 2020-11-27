import { botCache, Member } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("events", {
  name: "kick",
  aliases: ["k"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  cooldown: {
    seconds: 10,
  },
  arguments: [
    { name: "eventID", type: "number" },
    { name: "member", type: "member", required: false },
    { name: "memberID", type: "snowflake", required: false },
  ],
  execute: async function (message, args: EventsKickArgs, guild) {
    const event = await db.events.findOne(
      { guildID: message.guildID, eventID: args.eventID },
    );
    if (!event) return botCache.helpers.reactError(message);

    const userID = args.member?.id || args.membedID;
    if (!userID) return botCache.helpers.reactError(message);

    // They are not in it so just tell them they are out
    if (
      ![
        ...event.acceptedUserIDs,
        ...event.waitingUserIDs,
        ...event.maybeUserIDs,
      ].includes(userID)
    ) {
      return botCache.helpers.reactSuccess(message);
    }

    // Remove this id from the event
    const waitingUserIDs = event.waitingUserIDs.filter((id) => id !== userID);
    const acceptedUserIDs = event.acceptedUserIDs.filter((id) => id !== userID);
    const maybeUserIDs = event.maybeUserIDs.filter((id) => id !== userID);

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
    });

    // Trigger card again
    botCache.commands.get('events')?.subcommands?.get('card')?.execute?.(message, { eventID: args.eventID }, guild);
  },
});

interface EventsKickArgs {
  eventID: number;
  member?: Member;
  membedID?: string;
}
