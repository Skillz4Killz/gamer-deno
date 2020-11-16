import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import {
  createSubcommand,
  sendAlertResponse,
} from "../../../../utils/helpers.ts";
import { translate } from "../../../../utils/i18next.ts";

createSubcommand("settings-automod", {
  name: "profanity",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  guildOnly: true,
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
  ],
  execute: async function (message) {
    const settings = await db.guilds.get(message.guildID);

    const texts = [
      ...(settings?.profanityPhrases || []),
      ...(settings?.profanityStrictWords || []),
      ...(settings?.profanityWords || []),
    ];

    if (!texts.length) return botCache.helpers.reactError(message);

    const responses = botCache.helpers.chunkStrings(texts, 1800);
    for (const response of responses) {
      sendAlertResponse(
        message,
        [
          translate(
            message.guildID,
            "strings:LIST_PROFANITY",
            { username: message.author.username },
          ),
          "",
          response,
        ].join("\n"),
      );
    }
  },
});
