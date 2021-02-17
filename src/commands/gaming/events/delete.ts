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
  arguments: [{ name: "eventID", type: "number" }] as const,
  execute: async function (message, args) {
    const event = await db.events.findOne({
      guildID: message.guildID,
      eventID: args.eventID,
    });
    if (!event) return botCache.helpers.reactError(message);

    if (event.cardChannelID && event.cardMessageID) {
      await deleteMessageByID(event.cardChannelID, event.cardMessageID).catch(console.log);
    }

    await db.events.delete(event.id);

    return botCache.helpers.reactSuccess(message);
  },
});
