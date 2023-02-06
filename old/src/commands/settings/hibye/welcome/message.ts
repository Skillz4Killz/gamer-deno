import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-welcome", {
  name: "message",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [{ name: "text", type: "...string" }] as const,
  execute: async function (message, args) {
    try {
      // Validate the json
      JSON.parse(args.text);
      await db.welcome.update(message.guildID, { text: args.text });
      return botCache.helpers.reactSuccess(message);
    } catch {
      return botCache.helpers.reactError(message);
    }
  },
});
