import { botCache } from "../../../../../mod.ts";
import type { PermissionLevels } from "../../../../types/commands.ts";
import type { createSubcommand } from "../../../../utils/helpers.ts";
import type { guildsDatabase } from "../../../../database/schemas/guilds.ts";

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
