import { botCache, botID, editMember, higherRolePosition, highestRole, sendDirectMessage } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { Embed } from "../../utils/Embed.ts";
import { createCommand } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createCommand({
  name: "mute",
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["MANAGE_ROLES"],
  arguments: [
    { name: "member", type: "member" },
    { name: "duration", type: "duration", required: false },
    { name: "reason", type: "...string" },
  ] as const,
  guildOnly: true,
  execute: async function (message, args, guild) {
    if (!guild) return;

    const settings = await db.guilds.get(message.guildID);
    if (!settings?.muteRoleID) return botCache.helpers.reactError(message);

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

    const finalRoleIds = new Set([muteRole.id]);

    args.member.guilds.get(message.guildID)?.roles.forEach((roleId) => {
      if (guild.roles.get(roleId)?.isNitroBoostRole) finalRoleIds.add(roleId);
      if (guild.roles.get(roleId)?.managed) finalRoleIds.add(roleId);
    });

    // In 1 call remove all the roles, and add mute role
    await editMember(message.guildID, args.member.id, {
      roles: [...finalRoleIds],
      channel_id: null,
    });

    const embed = new Embed()
      .setDescription(
        translate(message.guildID, `strings:MUTE_TITLE`, {
          guildName: guild.name,
          username: args.member.tag,
        })
      )
      .setThumbnail(args.member.avatarURL)
      .setTimestamp()
      .addField(translate(message.guildID, `strings:REASON`), args.reason);

    await sendDirectMessage(args.member.id, { embed }).catch(console.log);

    // Time to mute the user all checks have passed
    await db.mutes.update(`${args.member.id}-${message.guildID}`, {
      userID: args.member.id,
      guildID: message.guildID,
      roleIDs: args.member.guilds.get(message.guildID)?.roles || [],
    });

    botCache.helpers.createModlog(message, {
      action: "mute",
      reason: args.reason,
      member: args.member,
      userID: args.member.id,
      duration: args.duration,
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
