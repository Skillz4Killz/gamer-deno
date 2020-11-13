import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod-links", {
  name: "enable",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  execute: function (message) {
    db.guilds.update(message.guildID, { linksEnabled: true });
    botCache.helpers.reactSuccess(message);
  },
});
