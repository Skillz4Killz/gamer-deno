import { botCache } from "../../../../cache.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-feedback", {
  name: "rejectedmessage",
  aliases: ["smessage"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "text", type: "...string" },
  ],
  execute: async (message, args: SettingsFeedbackRejectedmessageArgs) => {
    // Update settings, all requirements passed
    db.guilds.update(message.guildID, { rejectedMessage: args.text });
    return botCache.helpers.reactSuccess(message);
  },
});

interface SettingsFeedbackRejectedmessageArgs {
  text: string;
}
