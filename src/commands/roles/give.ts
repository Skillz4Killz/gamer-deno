import { botCache, highestRole, Member, Role, botID, higherRolePosition, addRole } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand('roles', {
    name: 'give',
    guildOnly: true,
    permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
    botServerPermissions: ["MANAGE_ROLES"],
    arguments: [
        { name: "member", type: "member" },
        { name: "role", type: "role" }
    ],
    execute: async function (message, args: CommandArgs, guild) {
        // Check if the bots role is high enough to manage the role
        const botsHighestRole = await highestRole(message.guildID, botID);
        if (!botsHighestRole) return botCache.helpers.reactError(message);

        if (!(await higherRolePosition(message.guildID, botsHighestRole.id, args.role.id))) return botCache.helpers.reactError(message);

        const memberHighestRole = await highestRole(message.guildID, message.author.id);
        if (!memberHighestRole) return botCache.helpers.reactError(message);

        if (!(await higherRolePosition(message.guildID, memberHighestRole.id, args.role.id))) return botCache.helpers.reactError(message);

        // Give the role to the user as all checks have passed
        addRole(message.guildID, args.member.id, args.role.id);
        botCache.helpers.reactSuccess(message);
    }
})

interface CommandArgs {
    role: Role;
    member: Member;
}