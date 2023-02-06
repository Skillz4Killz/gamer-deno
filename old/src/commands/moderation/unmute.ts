import { botCache, botID, editMember, higherRolePosition, highestRole, sendDirectMessage } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { Embed } from "../../utils/Embed.ts";
import { createCommand } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createCommand({
  name: "unmute",
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["MANAGE_ROLES"],
  arguments: [
    { name: "member", type: "member" },
    { name: "reason", type: "...string" },
  ] as const,
  guildOnly: true,
  execute: async function (message, args, guild) {
    if (!guild) return;

    const settings = await db.guilds.get(message.guildID);
    if (!settings?.muteRoleID) return botCache.helpers.reactError(message);
    const memberRoles = args.member.guilds.get(message.guildID)?.roles || [];
    if (!memberRoles.includes(settings.muteRoleID)) {
      return botCache.helpers.reactError(message);
    }

    const muteRole = guild.roles.get(settings.muteRoleID);
    if (!muteRole) return botCache.helpers.reactError(message);

    const botsHighestRole = await highestRole(message.guildID, botID);
    const membersHighestRole = await highestRole(message.guildID, args.member.id);
    const modsHighestRole = await highestRole(message.guildID, message.author.id);

    if (
      !botsHighestRole ||
      !membersHighestRole ||
      !(await higherRolePosition(message.guildID, botsHighestRole.id, membersHighestRole.id))
    ) {
      return botCache.helpers.reactError(message);
    }

    if (
      !modsHighestRole ||
      !membersHighestRole ||
      !(await higherRolePosition(message.guildID, modsHighestRole.id, membersHighestRole.id))
    ) {
      return botCache.helpers.reactError(message);
    }

    const muted = await db.mutes.get(`${args.member.id}-${message.guildID}`);
    if (!muted) return botCache.helpers.reactError(message);

    const roleIDs = new Set([...memberRoles, ...muted.roleIDs]);
    roleIDs.delete(muteRole.id);

    // In 1 call remove all the roles, and add mute role
    await editMember(message.guildID, args.member.id, {
      roles: [...roleIDs.values()],
    });

    await db.mutes.delete(`${args.member.id}-${message.guildID}`);

    const embed = new Embed()
      .setDescription(
        [
          translate(message.guildID, `strings:UNMUTE_TITLE`, {
            guildName: guild.name,
            username: args.member.tag,
          }),
          translate(message.guildID, "strings:REASON", { reason: args.reason }),
        ].join("\n")
      )
      .setThumbnail(args.member.avatarURL)
      .setTimestamp();

    await sendDirectMessage(args.member.id, { embed }).catch(console.log);

    botCache.helpers.createModlog(message, {
      action: "unmute",
      reason: args.reason,
      member: args.member,
      userID: args.member.id,
    });

    // Response that will get sent in the channel
    const response = botCache.helpers
      .authorEmbed(message)
      .setDescription(
        [
          translate(message.guildID, "strings:MODLOG_MEMBER", {
            name: `<@!${args.member.id}> ${args.member.tag} (${args.member.id})`,
          }),
          translate(message.guildID, "strings:REASON", { reason: args.reason }),
        ].join("\n")
      )
      .setTimestamp();

    return message.send({ embed: response });
  },
});
