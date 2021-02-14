import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("events-positions", {
  name: "delete",
  aliases: ["d"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [
    { name: "eventID", type: "number" },
    { name: "name", type: "string", lowercase: true },
  ] as const,
  execute: async function (message, args) {
    const event = await db.events.findOne({
      guildID: message.guildID,
      eventID: args.eventID,
    });
    if (!event) return botCache.helpers.reactError(message);

    // Delete the position so no one else can join it
    event.positions = event.positions.filter((p) => p.name !== args.name);

    // Remove any user's with this position
    event.acceptedUsers = event.acceptedUsers.map((user) => ({
      ...user,
      position: event.positions[0]?.name || "",
    }));

    // Remove all users
    await db.events.update(event.id, {
      positions: event.positions,
      acceptedUsers: event.acceptedUsers,
    });

    return botCache.helpers.reactSuccess(message);
  },
});
