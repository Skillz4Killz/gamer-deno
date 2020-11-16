import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod-profanity", {
  name: "disable",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  execute: function (message) {
    db.guilds.update(message.guildID, { profanityEnabled: false });
    botCache.helpers.reactSuccess(message);
  },
});
