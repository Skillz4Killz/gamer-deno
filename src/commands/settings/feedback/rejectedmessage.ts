import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-feedback", {
  name: "rejectedmessage",
  aliases: ["smessage"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [{ name: "text", type: "...string" }],
  execute: async (message, args) => {
    // Update settings, all requirements passed
    await db.guilds.update(message.guildID, { rejectedMessage: args.text });
    return botCache.helpers.reactSuccess(message);
  },
});
