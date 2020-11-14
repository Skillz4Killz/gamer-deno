import { sendMessage } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../cache.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles", {
  name: "messages",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message) => {
    const roleMessages = await db.rolemessages.findMany(
      { guildID: message.guildID },
      true,
    );
    if (!roleMessages?.length) return botCache.helpers.reactError(message);

    sendMessage(
      message.channelID,
      {
        content: roleMessages.map((rm) =>
          `<@&${rm.id}> ${rm.roleAddedText.substring(0, 50)} | <@&${rm.id}> ${
            rm.roleRemovedText.substring(0, 50)
          }`
        ).join("\n"),
        mentions: { parse: [] },
      },
    );
  },
});
