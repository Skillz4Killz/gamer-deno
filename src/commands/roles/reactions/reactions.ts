import { botCache, sendMessage } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles", {
  name: "reactions",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
  ],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
  cooldown: {
    seconds: 60,
    allowedUses: 2,
  },
  guildOnly: true,
  execute: async function (message) {
    const reactionroles = await db.reactionroles.findMany(
      { guildID: message.guildID },
      true,
    );
    if (!reactionroles.length) return botCache.helpers.reactError(message);

    const details = reactionroles
      .map(
        (rr, index) =>
          `${index + 1}. ${rr.name} => ${rr.messageID} => ${
            rr.reactions.map(
              (reaction) =>
                `${reaction.reaction} => ${
                  reaction.roleIDs.map((id) => `<@&${id}>`)
                }`,
            )
          }`,
      );

    const responses = botCache.helpers.chunkStrings(details);
    for (const response of responses) {
      sendMessage(
        message.channelID,
        { content: response, mentions: { parse: [] } },
      );
    }
  },
});
