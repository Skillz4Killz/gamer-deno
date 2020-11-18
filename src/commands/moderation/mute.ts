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
      !higherRolePosition(
        message.guildID,
        botsHighestRole.id,
        membersHighestRole.id,
      )
    ) {
      return botCache.helpers.reactError(message);
    }

    if (
      !modsHighestRole || !membersHighestRole ||
      !higherRolePosition(
        message.guildID,
        modsHighestRole.id,
        membersHighestRole.id,
      )
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

// unmute

// if (!message.guildID || !message.member) return

// const Gamer = context.client as GamerClient
// const botMember = await Gamer.helpers.discord.fetchMember(message.member.guild, Gamer.user.id)
// const language = Gamer.getLanguage(message.guildID)
// // Check if the bot has the ban permissions
// if (!botMember?.permissions.has('manageRoles'))
//   return message.channel.createMessage(language(`moderation/unmute:NEED_MANAGE_ROLES`))

// const guildSettings = await Gamer.database.models.guild.findOne({ guildID: message.guildID })
// // If there is default settings the mute role won't exist
// if (!guildSettings || !guildSettings.moderation.roleIDs.mute)
//   return message.channel.createMessage(language(`moderation/unmute:NEED_MUTE_ROLE`))

// if (!Gamer.helpers.discord.isModOrAdmin(message, guildSettings)) return

// // Check if the mute role exists
// const muteRole = message.member.guild.roles.get(guildSettings.moderation.roleIDs.mute)
// if (!muteRole) return

// const botsHighestRole = highestRole(botMember)
// if (botsHighestRole.position <= muteRole.position)
//   return message.channel.createMessage(language(`moderation/unmute:BOT_TOO_LOW`))

// const [userID] = args
// if (!userID) return message.channel.createMessage(language(`moderation/unmute:NEED_USER`))

// const user = await Gamer.helpers.discord.fetchUser(userID)
// if (!user) return message.channel.createMessage(language(`moderation/unmute:NEED_USER`))

// args.shift()
// // If it was a valid duration then remove it from the rest of the text
// const [time] = args
// const duration = time ? Gamer.helpers.transform.stringToMilliseconds(time) : undefined
// if (duration) args.shift()

// const reason = args.join(` `)
// if (!reason) return message.channel.createMessage(language(`moderation/unmute:NEED_REASON`))

// const member = await Gamer.helpers.discord.fetchMember(message.member.guild, user.id)
// if (!member) return

// if (!member.roles.includes(muteRole.id)) return message.channel.createMessage(language(`moderation/unmute:NOT_MUTED`))

// // Checks if the bot is higher than the user
// if (!Gamer.helpers.discord.compareMemberPosition(botMember, member))
//   return message.channel.createMessage(language(`moderation/unmute:BOT_TOO_LOW`))
// // Checks if the mod is higher than the user
// if (!Gamer.helpers.discord.compareMemberPosition(message.member, member))
//   return message.channel.createMessage(language(`moderation/unmute:USER_TOO_LOW`))

// removeRoleFromMember(member, guildSettings.moderation.roleIDs.mute)
// guildSettings.moderation.users.mutedUserIDs = guildSettings.moderation.users.mutedUserIDs.filter(
//   id => id !== member.id
// )
// guildSettings.save()

// const embed = new MessageEmbed()
//   .setDescription(
//     language(`moderation/unmute:TITLE`, { guildName: message.member.guild.name, username: user.username })
//   )
//   .setThumbnail(user.avatarURL)
//   .setTimestamp()
//   .addField(language(`common:REASON`), reason)

// // Send the user a message. AWAIT to make sure message is sent before they are banned and lose access
// const dmChannel = await user.getDMChannel().catch(() => undefined)
// if (dmChannel) dmChannel.createMessage({ embed: embed.code }).catch(() => undefined)

// const modlogID = await Gamer.helpers.moderation.createModlog(
//   message,
//   guildSettings,
//   language,
//   user,
//   `unmute`,
//   reason,
//   duration
// )

// // Response that will get sent in the channel
// const response = new MessageEmbed()
//   .setAuthor(language(`moderation/warn:MODERATOR`, { mod: message.author.username }), message.author.avatarURL)
//   .addField(
//     language(`moderation/modlog:MEMBER`),
//     language(`moderation/warn:MEMBER_INFO`, { member: member?.mention, user: member.username, id: member.id })
//   )
//   .addField(language(`common:REASON`), reason)
//   .setTimestamp()
//   .setFooter(language(`moderation/modlog:CASE`, { id: modlogID }))

// message.channel.createMessage({ embed: response.code })

// // Set this users mute log to no no longer need to unmute the user
// const log = await Gamer.database.models.modlog.findOne({
//   action: `mute`,
//   userID: member.id,
//   guildID: member.guild.id,
//   needsUnmute: true
// })

// if (!log) return
// log.needsUnmute = false
// return log.save()
