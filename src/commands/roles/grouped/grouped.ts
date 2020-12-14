import { sendMessage } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles", {
  name: "grouped",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      required: false
    },
  ],
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message) => {
    const sets = await db.groupedrolesets.findMany(
      { guildID: message.guildID },
      true,
    );
    if (!sets?.length) return botCache.helpers.reactError(message);

    const responses = botCache.helpers.chunkStrings(sets.map((set) =>
    `**${set.name}**: ${set.roleIDs.map((id) => `<@&${id}>`).join(" ")}`
  ))

  for (const response of responses) {
    sendMessage(
      message.channelID,
      {
        content: response,
        mentions: { parse: [] },
      },
      );
    }
  },
});
