import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles", {
  name: "messages",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message) => {
    const roleMessages = await db.rolemessages.findMany({ guildID: message.guildID }, true);
    if (!roleMessages?.length) return botCache.helpers.reactError(message);

    const responses = botCache.helpers.chunkStrings(
      roleMessages.map(
        (rm) =>
          `<@&${rm.id}> ${rm.roleAddedText.substring(0, 50)} | <@&${rm.id}> ${rm.roleRemovedText.substring(0, 50)}`
      )
    );

    for (const response of responses) {
      await message
        .send({
          content: response,
          mentions: { parse: [] },
        })
        .catch(console.log);
    }
  },
});
