import {
  addRole,
  botCache,
  botHasPermission,
  botID,
  cache,
  delay,
  getAuditLogs,
  getInvites,
  Guild,
  guildIconURL,
  higherRolePosition,
  highestRole,
  Member,
  rawAvatarURL,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { humanizeMilliseconds, sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.guildMemberAdd = async function (guild, member) {
  // If VIP guild, increment analytics
  vipMemberAnalytics(guild.id, true);
  handleWelcomeMessage(guild, member);
  handleServerLogs(guild, member, "add").catch(console.log);
  handleRoleAssignments(guild, member).catch(console.log);
};

botCache.eventHandlers.guildMemberRemove = function (guild, user, member) {
  // If VIP guild, increment analytics
  vipMemberAnalytics(guild.id, false);
  handleServerLogs(
    guild,
    member || {
      avatarURL: rawAvatarURL(user.id, user.discriminator, user.avatar),
      tag: `${user.username}#${user.discriminator}`,
      id: user.id,
    },
    "remove"
  ).catch(console.log);
};

function vipMemberAnalytics(id: string, joinEvent = true) {
  if (!botCache.vipGuildIDs.has(id)) return;

  if (joinEvent) {
    const current = botCache.analyticsMemberJoin.get(id);
    botCache.analyticsMemberJoin.set(id, (current || 0) + 1);
  } else {
    const current = botCache.analyticsMemberLeft.get(id);
    botCache.analyticsMemberLeft.set(id, (current || 0) + 1);
  }
}

async function handleWelcomeMessage(guild: Guild, member: Member) {
  const welcome = botCache.recentWelcomes.get(guild.id) || (await db.welcome.get(guild.id));
  if (!welcome?.channelID || !welcome.text) return;

  botCache.recentWelcomes.set(guild.id, welcome);

  try {
    const transformed = await botCache.helpers.variables(welcome.text, member, guild, member);
    const json = JSON.parse(transformed);
    const embed = new Embed(json);
    await sendEmbed(welcome.channelID, embed, json.plaintext);
  } catch {
    console.log("Welcome message failed for ", guild.id, "for ", member.id);
  }
}

async function handleServerLogs(
  guild: Guild,
  data: {
    tag: string;
    id: string;
    avatarURL: string;
  },
  type: "add" | "remove",
  member?: Member
) {
  // DISABLED LOGS
  const logs = botCache.recentLogs.has(guild.id)
    ? botCache.recentLogs.get(guild.id)
    : await db.serverlogs.get(guild.id);
  botCache.recentLogs.set(guild.id, logs);

  if (type === "add" && !logs?.memberAddChannelID) return;
  if (type == "remove" && !logs?.memberRemoveChannelID) return;
  if (!logs) return;

  const texts = [
    translate(guild.id, type === "add" ? "strings:MEMBER_JOINED" : "strings:MEMBER_REMOVED"),
    translate(guild.id, "strings:USER", { tag: data.tag, id: data.id }),
    translate(guild.id, "strings:TOTAL_USERS", {
      amount: guild.memberCount.toLocaleString("en-US"),
    }),
    translate(guild.id, "strings:ACCOUNT_AGE", {
      age: humanizeMilliseconds(Date.now() - botCache.helpers.snowflakeToTimestamp(data.id)),
    }),
  ];

  const embed = new Embed()
    .setAuthor(member?.tag ?? "", member?.avatarURL)
    .setDescription(texts.join("\n"))
    .setFooter(data.tag, guildIconURL(guild))
    .setThumbnail(data.avatarURL)
    .setTimestamp();

  // NON-VIPS GET BASIC ONLY
  if (!botCache.vipGuildIDs.has(guild.id)) {
    return sendEmbed(type === "add" ? logs.memberAddChannelID : logs.memberRemoveChannelID, embed);
  }

  // SEND PUBLIC
  if (type === "add" && logs?.memberAddPublic) {
    await sendEmbed(type === "add" ? logs.memberAddChannelID : logs.memberRemoveChannelID, embed);
  }

  // REMOVE DOES NOT NEED INVITE CHECKING, BUT IT NEEDS KICK CHECKING
  if (type === "remove") {
    // WAIT FOR AUDIT LOGS TO BE UPDATED
    await delay(2000);

    const auditlogs = await getAuditLogs(guild.id, {
      action_type: "MEMBER_KICK",
    });
    const relevant = auditlogs?.audit_log_entries.find((e: any) => e.target_id === data.id);
    // NO KICK LOG WAS FOUND, USER PROBABLY LEFT ON THEIR OWN
    if (!relevant) {
      return sendEmbed(logs.memberRemoveChannelID, embed)?.catch(console.log);
    }
    // IN CASE THIS MEMBER WAS KICKED BEFORE
    if (Date.now() - botCache.helpers.snowflakeToTimestamp(relevant.id) > 5000) {
      return sendEmbed(logs.memberRemoveChannelID, embed)?.catch(console.log);
    }

    // REMOVE THE LEFT ONE AND REPLACE WITH KICKED
    texts.shift();
    texts.unshift(translate(guild.id, "strings:MEMBER_KICKED"));
    if (relevant.reason) {
      texts.push(translate(guild.id, "strings:REASON", { reason: relevant.reason }));
    }
    if (member) {
      texts.push(
        translate(guild.id, "strings:LOGS_ROLES", {
          roles: [...(member.guilds.get(guild.id)?.roles || []), guild.id].map((id) => `<@&${id}>`).join(" "),
        })
      );
    }
    embed.setDescription(texts.join("\n"));
    return sendEmbed(logs.memberRemoveChannelID, embed)?.catch(console.log);
  }

  // GET INVITES
  const invites = await getInvites(guild.id).catch(console.log);
  if (!invites) {
    return sendEmbed(type === "add" ? logs.memberAddChannelID : logs.memberRemoveChannelID, embed);
  }

  // FIND THE INVITE WHOSE USES WENT UP
  const invite = invites.find((i: any) => {
    const cachedInvite = botCache.invites.get(i.code);
    if (!cachedInvite) return false;
    if (i.uses === cachedInvite.uses) return false;
    return true;
  });

  // ADD ALL INVITES TO CACHE FOR NEXT TIME
  invites.forEach(async (i: any) => {
    if (!i.inviter?.id) return;
    botCache.invites.set(i.code, {
      code: i.code,
      guildID: i.guild.id,
      channelID: i.channel.id,
      memberID: i.inviter.id,
      uses: i.uses,
    });
  });

  texts.push(
    translate(guild.id, "strings:INVITED_BY", {
      name: invite
        ? `${invite.inviter.username}#${invite.inviter.discriminator}`
        : cache.members.get(guild.ownerID)?.tag || translate(guild.id, "strings:UNKNOWN"),
      id: invite ? invite.inviter.id : guild.ownerID,
    })
  );
  embed.setDescription(texts.join("\n"));
  return sendEmbed(type === "add" ? logs.memberAddChannelID : logs.memberRemoveChannelID, embed);
}

async function handleRoleAssignments(guild: Guild, member: Member) {
  // In case other bots/users add a role to the user we do this check
  const botsHighestRole = await highestRole(guild.id, botID);
  const membersHighestRole = await highestRole(guild.id, member.id);
  if (!botsHighestRole || !membersHighestRole) return;

  if (
    !(await botHasPermission(guild.id, ["MANAGE_ROLES"])) ||
    !(await higherRolePosition(guild.id, botsHighestRole.id, membersHighestRole.id))
  ) {
    return;
  }

  const settings = await db.guilds.get(guild.id);
  if (!settings) return;

  const mute = await db.mutes.get(`${member.id}-${guild.id}`);
  // MUTE ROLE
  if (settings.muteRoleID && mute) {
    const muteRole = guild.roles.get(settings.muteRoleID);
    if (muteRole && (await higherRolePosition(guild.id, botsHighestRole.id, muteRole.id))) {
      await addRole(guild.id, member.id, muteRole.id, translate(guild.id, `strings:MEMBER_ADD_MUTED`)).catch(
        console.log
      );
    }
  }

  // Verify Or AutoRole

  // If verification is enabled and the role id is set add the verify role
  if (settings.verifyEnabled && settings.verifyRoleID) {
    const verifyRole = guild.roles.get(settings.verifyRoleID);
    if (verifyRole && (await higherRolePosition(guild.id, botsHighestRole.id, verifyRole.id))) {
      await addRole(guild.id, member.id, settings.verifyRoleID, translate(guild.id, `strings:VERIFY_ACTIVATE`)).catch(
        console.log
      );
    }
  } // If discord verification is disabled and auto role is set give the member the auto role
  else if (!settings.discordVerificationStrictnessEnabled) {
    const roleID = member.bot ? settings.botsAutoRoleID : settings.userAutoRoleID;
    if (!roleID) return;

    const autoRole = guild.roles.get(roleID);
    if (autoRole && (await higherRolePosition(guild.id, botsHighestRole.id, autoRole.id))) {
      await addRole(guild.id, member.id, roleID, translate(guild.id, `strings:AUTOROLE_ASSIGNED`)).catch(console.log);
    }
  }
}
