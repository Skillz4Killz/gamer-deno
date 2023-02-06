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
    { name: "position", type: "string", defaultValue: "", lowercase: true },
  ] as const,
  execute: async function (message, args, guild) {
    const event = await db.events.findOne({
      guildID: message.guildID,
      eventID: args.eventID,
    });
    if (!event) return botCache.helpers.reactError(message);

    // If a position was provided, validate the position
    if (args.position) {
      // If this event doesnt need positions reset it.
      if (!event.positions.length) args.position = "";
      // Find the appropriate position
      const position = event.positions.find((p) => p.name === args.position);
      // If the position can not be found, error out
      if (!position) return botCache.helpers.reactError(message);
    }

    // They are already joined
    if (event.acceptedUsers.some((user) => user.id === message.author.id)) {
      return botCache.helpers.reactSuccess(message);
    }

    // Check if the user has permission to join this event
    const member = cache.members.get(message.author.id)?.guilds.get(message.guildID);
    if (!member) return botCache.helpers.reactError(message);

    const hasPermission = event.allowedRoleIDs.length
      ? member.roles.some((roleID) => event.allowedRoleIDs.includes(roleID))
      : true;
    if (!hasPermission) return botCache.helpers.reactError(message);

    // If there is space to join
    if (event.maxAttendees > event.acceptedUsers.length) {
      // Remove this id from the event
      const waitingUsers = event.waitingUsers.filter((user) => user.id !== message.author.id);
      const acceptedUsers = [...event.acceptedUsers, { id: message.author.id, position: args.position }];
      const maybeUserIDs = event.maybeUserIDs.filter((id) => id !== message.author.id);
      const deniedUserIDs = event.deniedUserIDs.filter((id) => id !== message.author.id);

      await botCache.helpers.reactSuccess(message);

      // Remove them from the event
      await db.events.update(event.id, {
        acceptedUsers,
        waitingUsers,
        maybeUserIDs,
        deniedUserIDs,
      });

      // Trigger card again
      return (
        botCache.commands
          .get("events")
          ?.subcommands?.get("card")
          // @ts-ignore
          ?.execute?.(message, { eventID: args.eventID }, guild)
      );
    }

    // There is no space and user is already waiting
    if (event.waitingUsers.some((user) => user.id === message.author.id)) {
      return botCache.helpers.reactError(message);
    }

    // Add user to waiting list
    const waitingUsers = [...event.waitingUsers, { id: message.author.id, position: args.position }];
    const deniedUserIDs = event.deniedUserIDs.filter((id) => id !== message.author.id);

    await botCache.helpers.reactSuccess(message);

    await db.events.update(event.id, {
      waitingUsers,
      deniedUserIDs,
    });

    // Trigger card again
    return botCache.commands.get("events")?.subcommands?.get("card")?.execute?.(
      message,
      // @ts-ignore
      { eventID: args.eventID },
      guild
    );
  },
});
