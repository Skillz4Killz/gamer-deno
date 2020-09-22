import type { sendMessage } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import type { uniqueRoleSetsDatabase } from "../../../database/schemas/uniquerolesets.ts";
import { botCache } from "../../../../mod.ts";

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
    if (!sets?.length) return botCache.helpers.reactError(message);

    sendMessage(
      message.channel,
      {
        content: sets.map((set) =>
          `**${set.name}**: ${set.roleIDs.map((id) => `<@&${id}>`).join(" ")}`
        ).join("\n"),
        mentions: { parse: [] },
      },
    );
  },
});
