import { botCache } from "../../../../../mod.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-mails", {
  name: "autoresponse",
  aliases: ["ar", "response"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [{ name: "content", type: "...string" }],
  execute: (message, args: SettingsMailsAutoresponseArgs) => {
    db.guilds.update(message.guildID, {
      mailAutoResponse: args.content,
    });

    botCache.helpers.reactSuccess(message);
  },
});

interface SettingsMailsAutoresponseArgs {
  content: string;
}
