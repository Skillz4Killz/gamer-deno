import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { sendMessage } from "../../../deps.ts";

botCache.commands.set(`listallroles`, {
  name: `listallroles`,
  aliases: ["lar", "rolelist"],
  guildOnly: true,
  // vipServerOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async function (message, _args, guild) {
    if (!guild) return;

    const listroles = [...guild.roles.values()];
    const allRoles = listroles.sort((a, b) => b.position - a.position);

    let response = ``;
    for (const role of allRoles) {
      const allRoles = `${role.mention}  -> **${role.id}**\n`;
      if (response.length + allRoles.length >= 2000) {
        sendMessage(
          message.channel,
          { content: response, mentions: { parse: [] } },
        );
        response = ``;
      }
      response += allRoles;
    }
    sendMessage(
      message.channel,
      { content: response, mentions: { parse: [] } },
    );
  },
});
