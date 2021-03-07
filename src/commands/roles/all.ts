import {
  addRole,
  botCache,
  botID,
  delay,
  fetchMembers,
  higherRolePosition,
  highestRole,
  removeRole,
} from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";
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

    // SPECIAL ROLES CANNOT BE ASSIGNED/REMOVED
    if (args.role.id === message.guildID) return botCache.helpers.reactError(message);
    if (args.role.isNitroBoostRole) return botCache.helpers.reactError(message);
    if (args.role.managed) return botCache.helpers.reactError(message);

    const botsHighestRole = await highestRole(message.guildID, botID);
    if (!botsHighestRole) return botCache.helpers.reactError(message);

    const botIsHigher = await higherRolePosition(message.guildID, botsHighestRole.id, args.role.id);
    if (!botIsHigher) return botCache.helpers.reactError(message);

    const membersHighestRole = await highestRole(message.guildID, botID);
    if (!membersHighestRole) return botCache.helpers.reactError(message);

    const memberIsHigher = await higherRolePosition(message.guildID, membersHighestRole.id, args.role.id);
    if (!memberIsHigher) return botCache.helpers.reactError(message);

    const REASON = translate(message.guildID, "strings:ROLE_TO_ALL_REASON", {
      username: message.author.username,
    });

    let guildMembersCached = guild.members;
    if (guildMembersCached.size !== guild.memberCount) {
      await fetchMembers(guild);
      guildMembersCached = guild.members;
    }

    const patience = await message.reply(
      translate(message.guildID, "strings:ROLE_TO_ALL_PATIENCE", {
        amount: `0/${guildMembersCached.size}`,
        role: args.role.name,
      })
    );

    // Patience meme gif of yoda
    await message.alertReply("https://tenor.com/view/yoda-patience-you-must-have-patience-gif-15254127");

    // Create a counter that will help us rate limit the amount of members we are editing
    // Otherwise all role commands like .role .mute .verify stuff would not work until this finished
    let counter = 0;
    let totalCounter = 0;
    let rolesEdited = 0;

    for (const member of guildMembersCached.values()) {
      totalCounter++;
      console.log(
        `[ROLE_ALL] (${message.guildID}-${message.author.id}) ${args.type}: ${totalCounter} / ${guildMembersCached.size}`
      );

      if (totalCounter % 100 === 0) {
        await patience
          .edit(
            translate(message.guildID, "strings:ROLE_TO_ALL_PATIENCE", {
              amount: `${totalCounter}/${guildMembersCached.size}`,
              role: args.role.name,
            })
          )
          .catch(console.log);
      }

      const roles = member.guildMember(message.guildID)?.roles;
      if (!roles) continue;

      if (args.type === "add") {
        // IF THE MAMBER ALREADY HAS THE ROLE SKIP
        if (roles?.includes(args.role.id)) continue;
        // IF ANY OF THESE ROLES ARE ALREADY ON USER WE CAN SKIP
        if (args.defaultRoles?.some((r) => roles.includes(r.id))) continue;
      }

      if (args.type === "remove" && !roles.includes(args.role.id)) continue;

      console.log(
        `[ROLE_ALL_EDIT] (${message.guildID}-${message.author.id}) ${args.type}: ${totalCounter} / ${guildMembersCached.size}`
      );

      if (counter >= 3) {
        // MAKE THE BOT WAIT FOR 5 SECONDS
        await delay(5000);
        counter = 0;
      }

      // INCREMENT THE COUNTER
      counter++;

      // AWAIT IS IMPORTANT TO MAKE IT ASYNC TO PROTECT AGAIN USER DELETING ROLE
      await delay(10);

      // INCASE THE ROLE GETS DELETED DURING THE LOOP
      if (!guild.roles.has(args.role.id)) break;

      if (args.type === "add") {
        await addRole(message.guildID, member.id, args.role.id, REASON).catch(console.log);
      } else {
        await removeRole(message.guildID, member.id, args.role.id, REASON).catch(console.log);
      }

      rolesEdited++;
    }

    await patience.delete().catch(console.log);
    return message.reply(
      translate(message.guildID, `strings:ROLE_TO_ALL_SUCCESS`, {
        amount: rolesEdited,
      })
    );
  },
});
