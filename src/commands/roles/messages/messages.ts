import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("roles", {
  name: "messages",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "subcommand", type: "subcommand", required: false }] as const,
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message) => {
    message.reply("/roles");
    // const NONE = translate(message.guildID, "strings:NONE");

    // const roleMessages = await db.rolemessages.findMany({ guildID: message.guildID }, true);
    // if (!roleMessages?.length) return botCache.helpers.reactError(message, false, NONE);

    // const responses = botCache.helpers.chunkStrings(
    //   roleMessages.map(
    //     (rm) =>
    //       `➕ <@&${rm.id}> ${rm.roleAddedText.substring(0, 50) || NONE}\n➖ <@&${rm.id}> ${
    //         rm.roleRemovedText.substring(0, 50) || NONE
    //       }`
    //   )
    // );

    // for (const response of responses) {
    //   await message
    //     .send({
    //       content: response,
    //       mentions: { parse: [] },
    //     })
    //     .catch(console.log);
    // }
  },
});
