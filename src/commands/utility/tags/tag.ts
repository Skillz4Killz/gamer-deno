import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "tag",
  aliases: ["tags"],
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  guildOnly: true,
  botChannelPermissions: ["SEND_MESSAGES"],
  execute: async function (message) {
    // Fetch all tags for this guild
    const tags = await db.tags.findMany({ guildID: message.guildID }, true);
    if (!tags.length) return botCache.helpers.reactError(message);

    const responses = botCache.helpers.chunkStrings(tags.map((tag) => `**${tag.name}** ${tag.type}`));

    for (const response of responses) {
      await message.send({ content: response, mentions: { parse: [] } });
    }
  },
});
