import { botCache, removeReactionEmoji } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles-reactions", {
  name: "remove",
  aliases: ["r"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "emoji", type: "emoji" },
  ] as const,
  execute: async function (message, args, guild) {
    const reactionRole = await db.reactionroles.findOne(
      { guildID: message.guildID, name: args.name },
    );
    if (!reactionRole) return botCache.helpers.reactError(message);

    db.reactionroles.update(reactionRole.id, {
      reactions: reactionRole.reactions.filter((r) =>
        r.reaction === args.emoji
      ),
    });

    removeReactionEmoji(
      reactionRole.channelID,
      reactionRole.messageID,
      args.emoji,
    );
    botCache.helpers.reactSuccess(message);
  },
});
