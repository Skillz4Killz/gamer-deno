import { botCache } from "../../deps.ts";

botCache.inhibitors.set("commandperms", async function (message, command) {
  // Command perms are only required on guilds
  if (!message.guildID) return false;

  // Certain commands should not be allowed to be disabled
  if (["enable", "disable"].includes(command.name)) return false;

  // Check if a command perm has been created
  const commandPerms = botCache.commandPermissions.get(`${message.guildID}-${command.name}`);
  const allCommandsPerms = botCache.commandPermissions.get(`${message.guildID}-allcommands`);

  // If no custom its enabled
  if (!commandPerms && !allCommandsPerms) return false;

  if (commandPerms) {
    if (!commandPerms.enabled) {
      // The command is disabled but check if its disabled for this channel or any roles
      if (commandPerms.exceptionChannelIDs.includes(message.channelID)) {
        return false;
      }
      if (commandPerms.exceptionRoleIDs.some((id) => message.guildMember?.roles.includes(id))) {
        return false;
      }

      console.log(`${command.name} Inhbited: CommandPerms Missing`);
      return true;
    }

    // The command is enabled but check if it is disabled for any of these roles
    if (commandPerms.exceptionChannelIDs.includes(message.channelID)) {
      console.log(`${command.name} Inhbited: CommandPerms Missing`);
      return true;
    }
    if (commandPerms.exceptionRoleIDs.some((id) => message.guildMember?.roles.includes(id))) {
      console.log(`${command.name} Inhbited: CommandPerms Missing`);
      return true;
    }

    return false;
  }

  if (allCommandsPerms) {
    if (!allCommandsPerms.enabled) {
      if (allCommandsPerms.exceptionChannelIDs.includes(message.channelID)) {
        return false;
      }

      if (allCommandsPerms.exceptionRoleIDs.some((id) => message.guildMember?.roles.includes(id))) {
        return false;
      }

      console.log(`${command.name} Inhbited: CommandPerms Missing`);
      return true;
    }

    if (allCommandsPerms.exceptionChannelIDs.includes(message.channelID)) {
      console.log(`${command.name} Inhbited: CommandPerms Missing`);
      return true;
    }

    if (allCommandsPerms.exceptionRoleIDs.some((id) => message.guildMember?.roles.includes(id))) {
      console.log(`${command.name} Inhbited: CommandPerms Missing`);
      return true;
    }
  }

  return false;
});
