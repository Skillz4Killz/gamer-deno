import {
  botID,
  editMember,
  higherRolePosition,
  highestRole,
  Member,
  rawAvatarURL,
  sendDirectMessage,
} from "../../../deps.ts";
import { botCache } from "../../../cache.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand, sendEmbed } from "../../utils/helpers.ts";
import { db } from "../../database/database.ts";
import { Embed } from "../../utils/Embed.ts";
import { translate } from "../../utils/i18next.ts";

createCommand({
  name: `mute`,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["MANAGE_ROLES"],
  arguments: [
    { name: "member", type: "member" },
    { name: "duration", type: "duration", required: false },
    { name: "reason", type: "...string" },
  ],
  guildOnly: true,
  execute: async function (message, args: MuteArgs, guild) {
    if (!guild) return;

    const settings = await db.guilds.get(message.guildID);
    if (!settings?.muteRoleID) return botCache.helpers.reactError(message);

    const muteRole = guild.roles.get(settings.muteRoleID);
    if (!muteRole) return botCache.helpers.reactError(message);

    const botsHighestRole = await highestRole(message.guildID, botID);
    const membersHighestRole = await highestRole(
      message.guildID,
      args.member.id,
    );
    const modsHighestRole = await highestRole(
      message.guildID,
      message.author.id,
    );

    if (
      !botsHighestRole || !membersHighestRole ||
      !(await higherRolePosition(
        message.guildID,
        botsHighestRole.id,
        membersHighestRole.id,
      ))
    ) {
      return botCache.helpers.reactError(message);
    }

    if (
      !modsHighestRole || !membersHighestRole ||
      !(await higherRolePosition(
        message.guildID,
        modsHighestRole.id,
        membersHighestRole.id,
      ))
    ) {
      return botCache.helpers.reactError(message);
    }

    // In 1 call remove all the roles, and add mute role
    editMember(
      message.guildID,
      args.member.id,
      { roles: [muteRole.id], channel_id: null },
    );

    const embed = new Embed()
      .setDescription(
        translate(
          message.guildID,
          `commands/mute:TITLE`,
          { guildName: guild.name, username: args.member.tag },
        ),
      )
      .setThumbnail(args.member.avatarURL)
      .setTimestamp()
      .addField(translate(message.guildID, `common:REASON`), args.reason);

    sendDirectMessage(args.member.id, { embed });

    // Time to mute the user all checks have passed
    db.mutes.update(
      `${args.member.id}-${message.guildID}`,
      {
        userID: args.member.id,
        guildID: message.guildID,
        roleIDs: args.member.guilds.get(message.guildID)?.roles || [],
      },
    );

    const modlogID = await botCache.helpers.createModlog(
      message,
      {
        action: "mute",
        reason: args.reason,
        member: args.member,
        userID: args.member.id,
        duration: args.duration,
      },
    );

    // Response that will get sent in the channel
    const response = new Embed()
      .setAuthor(
        translate(
          message.guildID,
          `commands/warn:MODERATOR`,
          { mod: message.author.username },
        ),
        rawAvatarURL(
          message.author.id,
          message.author.discriminator,
          message.author.avatar,
        ),
      )
      .addField(
        translate(message.guildID, `commands/modlog:MEMBER`),
        translate(
          message.guildID,
          `commands/warn:MEMBER_INFO`,
          {
            member: `<@!${args.member.id}>`,
            user: args.member.tag,
            id: args.member.id,
          },
        ),
      )
      .addField(translate(message.guildID, `common:REASON`), args.reason)
      .setTimestamp()
      .setFooter(
        translate(message.guildID, `commands/modlog:CASE`, { id: modlogID }),
      );

    return sendEmbed(message.channelID, response);
  },
});

interface MuteArgs {
  member: Member;
  duration?: number;
  reason: string;
}
