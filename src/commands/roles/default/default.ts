import { sendMessage } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../mod.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles", {
  name: "default",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "subcommand", type: "subcommand" }],
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message) => {
    const sets = await db.defaultrolesets.findMany(
      { guildID: message.guildID },
      true,
    );
    if (!sets?.length) return botCache.helpers.reactError(message);

    sendMessage(
      message.channelID,
      {
        content: sets.map((set) =>
          `**${set.name}**: [ <@&${set.defaultRoleID}> ] ${
            set.roleIDs.map((id) => `<@&${id}>`).join(" ")
          }`
        ).join("\n"),
        mentions: { parse: [] },
      },
    );
  },
});
