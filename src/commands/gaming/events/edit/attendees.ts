import { botCache, cache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("events-edit", {
  name: "attendees",
  cooldown: {
    seconds: 30,
  },
  arguments: [
    { name: "eventID", type: "number" },
    { name: "amount", type: "number", minimum: 1 },
  ] as const,
  guildOnly: true,
  execute: async function (message, args, guild) {
    // Check if user has mod or admin perms
    const hasPerm =
      (await botCache.permissionLevels.get(PermissionLevels.MODERATOR)?.(message, this, guild)) ||
      (await botCache.permissionLevels.get(PermissionLevels.ADMIN)?.(message, this, guild));
    // Mod/admins bypass these checks
    if (!hasPerm) {
      const settings = await db.guilds.get(message.guildID);
      // User is not a mod admin so we have to see if they have the ability to create/edit these events.
      if (!settings?.createEventsRoleID) {
        return botCache.helpers.reactError(message);
      }

      // User does not have admin/mod or the necessary role so cancel out
      if (
        !cache.members.get(message.author.id)?.guilds.get(message.guildID)?.roles.includes(settings.createEventsRoleID)
      ) {
        return botCache.helpers.reactError(message);
      }
    }

    // User has permission to run this command

    const event = await db.events.findOne({
      eventID: args.eventID,
      guildID: message.guildID,
    });
    if (!event) return botCache.helpers.reactError(message);

    // If the user wasnt a mod or admin we have to make sure thy are the creator of this event
    if (!hasPerm && message.author.id !== event.userID) {
      return botCache.helpers.reactError(message);
    }

    // All necessary checks complete

    // Fill any empty spots from waiting list
    while (event.acceptedUsers.length < args.amount && event.waitingUsers.length) {
      if (!event.positions.length) {
        event.acceptedUsers.push(event.waitingUsers.shift()!);
        continue;
      }

      // This event requires positions
      const allowed = event.waitingUsers.find((user) => {
        // Get the position details for this users desired position
        const position = event.positions.find((p) => p.name === user.position);
        if (!position) return false;

        // If there is no space for this users desired position false
        if (event.acceptedUsers.filter((u) => u.position === user.position).length >= position.amount) {
          return false;
        }
        // There is space for this user
        return true;
      });
      if (!allowed) break;

      // Add user to accepted
      event.acceptedUsers.push(allowed);
      // Remove from waiting list
      event.waitingUsers = event.waitingUsers.filter((user) => user.id !== allowed.id);
    }

    await db.events.update(event.id, {
      maxAttendees: args.amount,
      waitingUsers: event.waitingUsers,
      acceptedUsers: event.waitingUsers,
    });

    return botCache.helpers.reactSuccess(message);
  },
});
