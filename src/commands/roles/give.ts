import { addRole, botCache, botID, higherRolePosition, highestRole } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("roles", {
  name: "give",
  aliases: ["add"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["MANAGE_ROLES"],
  arguments: [
    { name: "member", type: "member" },
    { name: "role", type: "role" },
  ] as const,
  execute: async function (message, args) {
    if (args.member.guilds.get(message.guildID)?.roles.includes(args.role.id)) {
      return botCache.helpers.reactSuccess(message);
    }

    const botsHighestRole = await highestRole(message.guildID, botID);
    if (!botsHighestRole) return botCache.helpers.reactError(message);

    // Prevents a mod from giving themself the admin role for example
    const memberHighestRole = await highestRole(message.guildID, message.author.id);
    if (!memberHighestRole) return botCache.helpers.reactError(message);

    if (
      !(await higherRolePosition(message.guildID, memberHighestRole.id, args.role.id)) ||
      !(await higherRolePosition(message.guildID, botsHighestRole.id, args.role.id))
    ) {
      return botCache.helpers.reactError(message);
    }

    // Give the role to the user as all checks have passed
    await addRole(message.guildID, args.member.id, args.role.id).catch(console.log);
    return botCache.helpers.reactSuccess(message);
  },
});
