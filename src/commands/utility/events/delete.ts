import { botCache, deleteMessageByID } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("events", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  cooldown: {
    seconds: 10,
  },
  arguments: [
    { name: "eventID", type: "number" },
  ],
  execute: async function (message, args: EventsDeleteArgs) {
    const event = await db.events.findOne(
      { guildID: message.guildID, eventID: args.eventID },
    );
    if (!event) return botCache.helpers.reactError(message);

    if (event.cardChannelID && event.cardMessageID) {
      deleteMessageByID(event.cardChannelID, event.cardMessageID).catch(() =>
        undefined
      );
    }

    db.events.delete(event.id);

    botCache.helpers.reactSuccess(message);
  },
});

interface EventsDeleteArgs {
  eventID: number;
}
