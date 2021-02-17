import { botCache } from "../../../../cache.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-events", {
  name: "card",
  aliases: ["c", "ad", "advertise"],
  arguments: [{ name: "channel", type: "guildtextchannel", required: false }] as const,
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  execute: async function (message, args) {
    await db.guilds.update(message.guildID, {
      eventsAdvertiseChannelID: args.channel?.id,
    });
    return botCache.helpers.reactSuccess(message);
  },
});
