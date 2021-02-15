import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("events-positions", {
  name: "create",
  aliases: ["c"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  vipServerOnly: true,
  arguments: [
    { name: "eventID", type: "number" },
    { name: "name", type: "string", lowercase: true },
    { name: "amount", type: "number" },
  ] as const,
  execute: async function (message, args) {
    const event = await db.events.findOne({
      guildID: message.guildID,
      eventID: args.eventID,
    });
    if (!event) return botCache.helpers.reactError(message);

    if (args.amount > event.maxAttendees) {
      return botCache.helpers.reactError(message);
    }
    if (args.amount < 1) args.amount = 1;

    // Make sure this position does not already exists
    if (event.positions.some((p) => p.name === args.name)) {
      return botCache.helpers.reactError(message);
    }

    await db.events.update(event.id, {
      positions: [...event.positions, { name: args.name, amount: args.amount || 1 }],
    });

    return botCache.helpers.reactSuccess(message);
  },
});
