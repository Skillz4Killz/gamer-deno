import {
  addRole,
  botCache,
  botID,
  cache,
  delay,
  deleteMessageByID,
  editMessage,
  fetchMembers,
  higherRolePosition,
  highestRole,
  removeRole,
  Role,
} from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand, sendResponse } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createSubcommand("roles", {
  name: "all",
  permissionLevels: [PermissionLevels.ADMIN],
  botChannelPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  botServerPermissions: ["MANAGE_ROLES"],
  userServerPermissions: ["MANAGE_ROLES"],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "role", type: "role" },
  ],
  execute: async function (message, args: RolesMembersArgs, guild) {
    if (!guild) return;

    const botsHighestRole = await highestRole(message.guildID, botID);
    if (!botsHighestRole) return botCache.helpers.reactError(message);

    const botIsHigher = await higherRolePosition(
      message.guildID,
      botsHighestRole.id,
      args.role.id,
    );
    if (!botIsHigher) return botCache.helpers.reactError(message);

    const membersHighestRole = await highestRole(message.guildID, botID);
    if (!membersHighestRole) return botCache.helpers.reactError(message);

    const memberIsHigher = await higherRolePosition(
      message.guildID,
      membersHighestRole.id,
      args.role.id,
    );
    if (!memberIsHigher) return botCache.helpers.reactError(message);

    const REASON = translate(
      message.guildID,
      "strings:ROLE_TO_ALL_REASON",
      { username: message.author.username },
    );

    const guildMembersCached = cache.members.filter((m) =>
      m.guilds.has(guild.id)
    );
    if (guildMembersCached.size !== guild.memberCount) {
      await fetchMembers(guild);
    }

    const patience = await sendResponse(
      message,
      translate(
        message.guildID,
        "strings:ROLE_TO_ALL_PATIENCE",
        { amount: guildMembersCached.size, role: args.role.name },
      ),
    );
    // Patience meme gif of yoda
    sendResponse(
      message,
      "https://tenor.com/view/yoda-patience-you-must-have-patience-gif-15254127",
    );

    // Create a counter that will help us rate limit the amount of members we are editing
    // Otherwise all role commands like .role .mute .verify stuff would not work until this finished
    let counter = 0;
    let totalCounter = 0;
    let rolesGranted = 0;

    for (const member of cache.members.values()) {
      if (!member.guilds.has(message.guildID)) continue;

      totalCounter++;

      if (totalCounter % 100 === 0) {
        editMessage(
          patience,
          translate(
            message.guildID,
            "strings:ROLE_TO_ALL_PATIENCE",
            {
              amount: `${totalCounter}/${guildMembersCached.size}`,
              role: args.role.name,
            },
          ),
        );
      }

      // If the member has the role already skip
      if (member.guilds.get(guild.id)?.roles.includes(args.role.id)) continue;

      if (counter === 3) {
        // Make the bot wait for 5 seconds
        await delay(5000);
        counter = 0;
      }

      // Incase the role gets deleted during the loop
      if (!guild.roles.has(args.role.id)) continue;

      // Increment the counter
      counter++;

      // Need this await to make the loop async so that if a user deletes a role it will break in the check above
      if (args.type === "add") {
        await addRole(message.guildID, member.id, args.role.id, REASON);
      } else await removeRole(message.guildID, member.id, args.role.id, REASON);

      rolesGranted++;
    }

    deleteMessageByID(message.channelID, patience.id).catch(() => undefined);
    sendResponse(
      message,
      translate(
        message.guildID,
        `strings:ROLE_TO_ALL_SUCCESS`,
        { amount: rolesGranted },
      ),
    );
  },
});

interface RolesMembersArgs {
  type: "add" | "remove";
  role: Role;
}
