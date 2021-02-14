import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod-profanity", {
  name: "enable",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  execute: async function (message) {
    await db.guilds.update(message.guildID, {
      profanityEnabled: true,
      profanityWords: botCache.constants.profanity.soft,
      profanityStrictWords: botCache.constants.profanity.strict,
      profanityPhrases: ["kill yourself", "kill myself"],
    });
    return botCache.helpers.reactSuccess(message);
  },
});
