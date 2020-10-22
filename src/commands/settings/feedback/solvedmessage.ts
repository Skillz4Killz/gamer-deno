import { botCache } from "../../../../mod.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-feedback", {
  name: "solvedmessage",
  aliases: ["smessage"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "text", type: "...string" },
  ],
  execute: async (message, args: SettingsFeedbackSolvedmessageArgs) => {
    // Update settings, all requirements passed
    db.guilds.update(message.guildID, { solvedMessage: args.text });
    return botCache.helpers.reactSuccess(message);
  },
});

interface SettingsFeedbackSolvedmessageArgs {
  text: string;
}
