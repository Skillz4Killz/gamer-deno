import { botCache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { CommandSchema } from "../../database/schemas.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "enable",
  arguments: [
    { name: "command", type: "command", required: false },
    { name: "all", type: "string", literals: ["all"], required: false },
  ] as const,
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async function (message, args) {
    if (!args.command && !args.all) return botCache.helpers.reactError(message);

    const name = `${message.guildID}-${args.command?.name || "allcommands"}`;

    const command = await db.commands.get(name);
    if (!command) return botCache.helpers.reactSuccess(message);

    const payload: Partial<CommandSchema> = {};

    // NO CHANNELS OR ROLES PROVIDED
    if (!message.mentionChannelIDs.length && !message.mentionRoleIDs.length) {
      await db.commands.update(name, {
        enabled: true,
        exceptionChannelIDs: [],
        exceptionRoleIDs: [],
      });
      botCache.commandPermissions.delete(name);
      return botCache.helpers.reactSuccess(message);
    }

    for (const channelID of message.mentionChannelIDs) {
      // If command is enabled and channel was disabled remove the channel
      if (command.enabled && command.exceptionChannelIDs.includes(channelID)) {
        payload.exceptionChannelIDs = command.exceptionChannelIDs.filter((id) => id !== channelID);
      }

      // If the command is disabled and this channel was not an exception add it
      if (!command.enabled && !command.exceptionChannelIDs.includes(channelID)) {
        payload.exceptionChannelIDs = [...command.exceptionChannelIDs, channelID];
      }
    }

    for (const roleID of message.mentionRoleIDs) {
      // If command is enabled and role was disabled remove the role
      if (command.enabled && command.exceptionRoleIDs.includes(roleID)) {
        payload.exceptionRoleIDs = command.exceptionRoleIDs.filter((id) => id !== roleID);
      }

      // If the command is disabled and this role was not an exception add it
      if (!command.enabled && !command.exceptionRoleIDs.includes(roleID)) {
        payload.exceptionRoleIDs = [...command.exceptionRoleIDs, roleID];
      }
    }

    await db.commands.update(name, payload);
    botCache.commandPermissions.set(name, { ...command, ...payload });
    return botCache.helpers.reactSuccess(message);
  },
});
