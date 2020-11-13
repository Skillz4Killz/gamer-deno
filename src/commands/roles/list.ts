import { PermissionLevels } from "../../types/commands.ts";
import { botCache, sendMessage } from "../../../deps.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("roles", {
  name: `list`,
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async function (message, _args, guild) {
    if (!guild) return;

    const listroles = [...guild.roles.values()];
    const allRoles = listroles.sort((a, b) => b.position - a.position);

    const responses = botCache.helpers.chunkStrings(
      allRoles.map((role) => `${role.mention}  -> **${role.id}**\n`),
    );
    for (const response of responses) {
      sendMessage(
        message.channelID,
        { content: response, mentions: { parse: [] } },
      );
    }
  },
});
