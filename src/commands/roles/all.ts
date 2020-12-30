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
} from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import {
  createSubcommand,
  sendAlertResponse,
  sendResponse,
} from "../../utils/helpers.ts";
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
    { name: "defaultRoles", type: "...roles", required: false },
    { name: "groupedRoles", type: "...roles", required: false },
  ] as const,
  execute: async function (message, args, guild) {
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
        { amount: `${0}/${guildMembersCached.size}`, role: args.role.name },
      ),
    );
    // Patience meme gif of yoda
    sendAlertResponse(
      message,
      "https://tenor.com/view/yoda-patience-you-must-have-patience-gif-15254127",
    );

    // Create a counter that will help us rate limit the amount of members we are editing
    // Otherwise all role commands like .role .mute .verify stuff would not work until this finished
    let counter = 0;
    let totalCounter = 0;
    let rolesEdited = 0;

    for (const member of cache.members.values()) {
      if (!member.guilds.has(message.guildID)) continue;

      totalCounter++;
      console.log(
        `[ROLE_ALL] (${message.guildID}-${message.author.id}) ${args.type}: ${totalCounter} / ${guildMembersCached.size}`,
      );

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
      if (args.type === "add") {
        const roles = member.guilds.get(guild.id)?.roles;
        if (member.guilds.get(guild.id)?.roles.includes(args.role.id)) continue;
        // IF ANY OF THESE ROLES ARE ALREADY ON USER WE CAN SKIP
        if (args.defaultRoles?.some((r) => roles?.includes(r.id))) continue;
      }

      if (
        args.type === "remove" &&
        !member.guilds.get(guild.id)?.roles.includes(args.role.id)
      ) {
        continue;
      }

      console.log(
        `[ROLE_ALL_EDIT] (${message.guildID}-${message.author.id}) ${args.type}: ${totalCounter} / ${guildMembersCached.size}`,
      );
      if (counter === 3) {
        // Make the bot wait for 5 seconds
        await delay(5000);
        counter = 0;
      }

      // Incase the role gets deleted during the loop
      if (!guild.roles.has(args.role.id)) continue;

      // Increment the counter
      counter++;

      // Await is important to make it async to protect again user deleting role
      await delay(10);

      if (args.type === "add") {
        await addRole(message.guildID, member.id, args.role.id, REASON);
      } else removeRole(message.guildID, member.id, args.role.id, REASON);

      rolesEdited++;
    }

    deleteMessageByID(message.channelID, patience.id).catch(() => undefined);
    await sendResponse(
      message,
      translate(
        message.guildID,
        `strings:ROLE_TO_ALL_SUCCESS`,
        { amount: rolesEdited },
      ),
    );
  },
});
