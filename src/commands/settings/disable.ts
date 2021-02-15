import { botCache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { CommandSchema } from "../../database/schemas.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "disable",
  arguments: [
    { name: "command", type: "command", required: false },
    { name: "all", type: "string", literals: ["all"], required: false },
  ] as const,
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async function (message, args) {
    if (!args.command && !args.all) return botCache.helpers.reactError(message);

    const name = `${message.guildID}-${args.command?.name || "allcommands"}`;

    const command = await db.commands.get(name);

    const payload: Partial<CommandSchema> = {};

    // NO CHANNELS OR ROLES PROVIDED
    if (!message.mentionChannelIDs.length && !message.mentionRoleIDs.length) {
      await db.commands.update(name, {
        enabled: false,
        exceptionChannelIDs: [],
        exceptionRoleIDs: [],
        guildID: message.guildID,
      });
      botCache.commandPermissions.set(name, {
        id: name,
        guildID: message.guildID,
        enabled: false,
        exceptionChannelIDs: [],
        exceptionRoleIDs: [],
      });
      return botCache.helpers.reactSuccess(message);
    }

    // If there was no command before this we need to create it and disable it in the mentioned channels & roles
    if (!command) {
      const newPayload: CommandSchema = {
        id: name,
        enabled: Boolean(message.mentionChannelIDs.length || message.mentionRoleIDs.length),
        guildID: message.guildID,
        exceptionChannelIDs: message.mentionChannelIDs,
        exceptionRoleIDs: message.mentionRoleIDs,
      };

      await db.commands.create(name, newPayload);
      botCache.commandPermissions.set(name, { ...newPayload });
      return botCache.helpers.reactSuccess(message);
    }

    for (const channelID of message.mentionChannelIDs) {
      // If command is enabled and channel was NOT disabled add the channel
      if (command.enabled && !command.exceptionChannelIDs.includes(channelID)) {
        payload.exceptionChannelIDs = [...command.exceptionChannelIDs, channelID];
      }

      // If the command is disabled and this channel was not an exception add it
      if (!command.enabled && command.exceptionChannelIDs.includes(channelID)) {
        payload.exceptionChannelIDs = command.exceptionChannelIDs.filter((id) => id !== channelID);
      }
    }

    for (const roleID of message.mentionRoleIDs) {
      // If command is enabled and roleID was NOT disabled add the roleID
      if (command.enabled && !command.exceptionRoleIDs.includes(roleID)) {
        payload.exceptionRoleIDs = [...command.exceptionRoleIDs, roleID];
      }

      // If the command is disabled and this roleID was not an exception add it
      if (!command.enabled && command.exceptionRoleIDs.includes(roleID)) {
        payload.exceptionRoleIDs = command.exceptionRoleIDs.filter((id) => id !== roleID);
      }
    }

    await db.commands.update(name, payload);
    botCache.commandPermissions.set(name, { ...command, ...payload });
    return botCache.helpers.reactSuccess(message);
  },
});
