import { botCache } from "../../../../../mod.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-mails", {
  name: "disable",
  aliases: ["off"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  execute: (message) => {
    db.guilds.update(message.guildID, { mailsEnabled: false });

    botCache.helpers.reactSuccess(message);
  },
});
