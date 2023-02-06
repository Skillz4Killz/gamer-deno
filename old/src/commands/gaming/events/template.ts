import { botCache, deleteMessageByID } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("events", {
  name: "template",
  aliases: ["t"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  cooldown: {
    seconds: 30,
  },
  arguments: [
    { name: "eventID", type: "number" },
    { name: "name", type: "string" },
  ] as const,
  vipServerOnly: true,
  guildOnly: true,
  execute: async function (message, args) {
    const event = await db.events.findOne({
      eventID: args.eventID,
      guildID: message.guildID,
    });
    if (!event) return botCache.helpers.reactError(message);

    // All necessary checks complete
    await db.events.update(event.id, { templateName: args.name });
    // DELETE THE CARD FOR THIS EVENT
    if (event.cardChannelID && event.cardMessageID) {
      await deleteMessageByID(event.cardMessageID, event.cardMessageID).catch(console.log);
    }
    return botCache.helpers.reactSuccess(message);
  },
});
