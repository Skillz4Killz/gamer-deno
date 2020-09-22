import { botCache } from "../../../../../mod.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { guildsDatabase } from "../../../../database/schemas/guilds.ts";

createSubcommand("settings-mails", {
  name: "enable",
  aliases: ["on"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  execute: (message) => {
    guildsDatabase.updateOne({ guildID: message.guildID }, {
      $set: { mailsEnabled: true },
    });

    botCache.helpers.reactSuccess(message);
  },
});
