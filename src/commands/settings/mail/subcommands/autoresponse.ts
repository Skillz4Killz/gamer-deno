import { botCache } from "../../../../../mod.ts";
import type { PermissionLevels } from "../../../../types/commands.ts";
import type { createSubcommand } from "../../../../utils/helpers.ts";
import type { guildsDatabase } from "../../../../database/schemas/guilds.ts";

createSubcommand("settings-mails", {
  name: "autoresponse",
  aliases: ["ar", "response"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [{ name: "content", type: "...string" }],
  execute: (message, args: SettingsMailsAutoresponseArgs) => {
    guildsDatabase.updateOne({ guildID: message.guildID }, {
      $set: { mailAutoResponse: args.content },
    });

    botCache.helpers.reactSuccess(message);
  },
});

interface SettingsMailsAutoresponseArgs {
  content: string;
}
