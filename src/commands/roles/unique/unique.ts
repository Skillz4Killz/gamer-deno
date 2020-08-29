import { addReaction, sendMessage } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { uniqueRoleSetsDatabase } from "../../../database/schemas/uniquerolesets.ts";

createSubcommand("roles", {
  name: "unique",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      literals: ["create", "delete", "add", "remove"],
    },
  ],
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message) => {
    const sets = await uniqueRoleSetsDatabase.find(
      { guildID: message.guildID },
    );
    // @ts-ignore TODO: fix once mongodb fix
    if (!sets?.length) return addReaction(message.channelID, message.id, "❌");

    sendMessage(
      message.channel,
      {
        // @ts-ignore TODO: fix once mongodb fix
        content: sets.map((set) =>
          // @ts-ignore TODO: fix once mongodb fix
          `**${set.name}**: ${set.roleIDs.map((id) => `<@&${id}>`).join(" ")}`
        ).join("\n"),
        mentions: { parse: [] },
      },
    );
  },
});
