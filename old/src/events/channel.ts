import {
  botCache,
  botHasChannelPermissions,
  botID,
  cache,
  calculatePermissions,
  Channel,
  delay,
  editChannel,
  getAuditLogs,
  guildIconURL,
  higherRolePosition,
  highestRole,
  OverwriteType,
  rawAvatarURL,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { GuildSchema } from "../database/schemas.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.channelCreate = async function (channel) {
  handleChannelLogs(channel, "create").catch(console.log);

  const settings = await db.guilds.get(channel.guildID);
  if (!settings) return;

  const botsHighestRole = await highestRole(channel.guildID, botID);
  if (!botsHighestRole) return;

  if (!(await botHasChannelPermissions(channel.id, ["MANAGE_ROLES", "MANAGE_CHANNELS"]))) {
    return;
  }

  if (settings.muteRoleID) {
    handleMuteRole(channel, settings, botsHighestRole.id);
  }
  if (settings.verifyRoleID) {
    handleVerifyRole(channel, settings, botsHighestRole.id);
  }
};

botCache.eventHandlers.channelDelete = function (channel) {
  handleChannelLogs(channel, "delete").catch(console.log);
};

botCache.eventHandlers.channelUpdate = async function (channel, cachedChannel) {
  const logs = botCache.recentLogs.has(channel.guildID)
    ? botCache.recentLogs.get(channel.guildID)
    : await db.serverlogs.get(channel.guildID);
  botCache.recentLogs.set(channel.guildID, logs);

  // IF LOGS ARE DISABLED
  if (!logs?.channelUpdateChannelID) return;

  // IF CHANNELS WERE REQUESTED TO BE IGNORED
  if (botCache.vipGuildIDs.has(channel.guildID) && logs.channelUpdateIgnoredChannelIDs?.includes(channel.id)) {
    return;
  }

  // MOVING 1 CHANNEL CAN TRIGGER LIKE 50. TO AVOID RATE LIMITING
  if (channel.position !== cachedChannel.position) return;

  // CREATE BASE EMBED
  const guild = cache.guilds.get(channel.guildID);
  const texts = [
    translate(channel.guildID, "strings:LOGS_CHANNEL_UPDATED", {
      mention: `<#${channel.id}>`,
      name: channel.name,
    }),
    translate(channel.guildID, "strings:CHANNEL_ID", { id: channel.id }),
    translate(channel.guildID, "strings:TOTAL_CHANNELS", {
      amount: cache.channels.filter((c) => c.guildID === channel.guildID).size.toLocaleString("en-US"),
    }),
    translate(channel.guildID, "strings:TYPE", {
      type: translate(channel.guildID, `strings:CHANNEL_TYPE_${channel.type}`),
    }),
    translate(channel.guildID, "strings:LOGS_CREATED_ON", {
      time: new Date(botCache.helpers.snowflakeToTimestamp(channel.id)).toISOString().substr(0, 10),
    }),
  ];

  if (channel.name !== cachedChannel.name) {
    texts.push(
      translate(channel.guildID, "strings:NAME_CHANGED", {
        old: cachedChannel.name,
        new: channel.name,
      })
    );
  }
  if (channel.nsfw !== cachedChannel.nsfw) {
    texts.push(
      translate(channel.guildID, "strings:NSFW_CHANGED", {
        old: botCache.helpers.booleanEmoji(cachedChannel.nsfw),
        new: botCache.helpers.booleanEmoji(channel.nsfw),
      })
    );
  }
  if (channel.topic !== cachedChannel.topic) {
    texts.push(
      translate(channel.guildID, "strings:TOPIC_CHANGED", {
        old: cachedChannel.topic,
        new: channel.topic,
      })
    );
  }
  if (channel.bitrate !== cachedChannel.bitrate) {
    texts.push(
      translate(channel.guildID, "strings:BITRATE_CHANGED", {
        old: cachedChannel.bitrate,
        new: channel.bitrate,
      })
    );
  }
  if (channel.rateLimitPerUser !== cachedChannel.rateLimitPerUser) {
    texts.push(
      translate(channel.guildID, "strings:SLOWMODE_CHANGED", {
        old: cachedChannel.rateLimitPerUser,
        new: channel.rateLimitPerUser,
      })
    );
  }
  if (channel.userLimit !== cachedChannel.userLimit) {
    texts.push(
      translate(channel.guildID, "strings:USERLIMIT_CHANGED", {
        old: cachedChannel.userLimit,
        new: channel.userLimit,
      })
    );
  }

  const embed = new Embed()
    .setDescription(texts.join("\n"))
    .setTimestamp()
    .setFooter(channel.name || channel.id, guild ? guildIconURL(guild) : undefined);

  if (botCache.vipGuildIDs.has(channel.guildID) && logs.publicChannelID && logs.channelUpdatePublic) {
    await sendEmbed(logs.publicChannelID, embed);
  }

  return sendEmbed(logs.channelUpdateChannelID, embed);
};

async function handleChannelLogs(channel: Channel, type: "create" | "delete") {
  const logs = botCache.recentLogs.has(channel.guildID)
    ? botCache.recentLogs.get(channel.guildID)
    : await db.serverlogs.get(channel.guildID);
  botCache.recentLogs.set(channel.guildID, logs);

  // IF LOGS ARE DISABLED
  if (!logs) return;
  const logChannelID =
    type === "create"
      ? logs.channelCreateChannelID
      : type === "delete"
      ? logs.channelDeleteChannelID
      : logs.channelUpdateChannelID;
  if (!logChannelID) return;

  const guild = cache.guilds.get(channel.guildID);
  const texts = [
    translate(
      channel.guildID,
      type === "create"
        ? "strings:LOGS_CHANNEL_CREATED"
        : type === "delete"
        ? "strings:LOGS_CHANNEL_DELETED"
        : "strings:LOGS_CHANNEL_UPDATED",
      { mention: `<#${channel.id}>`, name: channel.name }
    ),
    translate(channel.guildID, "strings:CHANNEL_ID", { id: channel.id }),
    translate(channel.guildID, "strings:TOTAL_CHANNELS", {
      amount: cache.channels.filter((c) => c.guildID === channel.guildID).size.toLocaleString("en-US"),
    }),
    translate(channel.guildID, "strings:TYPE", {
      type: translate(channel.guildID, `strings:CHANNEL_TYPE_${channel.type}`),
    }),
  ];

  if (type !== "create") {
    texts.push(
      translate(channel.guildID, "strings:LOGS_CREATED_ON", {
        time: new Date(botCache.helpers.snowflakeToTimestamp(channel.id)).toISOString().substr(0, 10),
      })
    );
  }

  const category = channel.parentID ? cache.channels.get(channel.parentID)?.name : "";
  if (category) {
    texts.push(translate(channel.guildID, "strings:CATEGORY", { category }));
  }

  if (channel.position) {
    texts.push(
      translate(channel.guildID, "strings:LOGS_POSITION", {
        position: channel.position.toString(),
      })
    );
  }

  const embed = new Embed()
    .setDescription(texts.join("\n"))
    .setThumbnail(type === "delete" ? "https://i.imgur.com/iZPBVKB.png" : `https://i.imgur.com/Ya0SXdI.png`)
    .setTimestamp()
    .setFooter(channel.name || channel.id, guild ? guildIconURL(guild) : undefined);

  // NO VIP SO ONLY BASIC LOGS ARE SENT
  if (!botCache.vipGuildIDs.has(channel.guildID)) {
    return sendEmbed(logChannelID, embed);
  }

  // PUBLIC LOG SEND
  if (
    logs.publicChannelID &&
    ((type === "create" && logs.channelCreatePublic) || (type === "delete" && logs.channelDeletePublic))
  ) {
    await sendEmbed(logs.publicChannelID, embed);
  }

  // Allow few seconds to have this be added to the audit logs
  await delay(2000);

  // VIP GET EXTRA FEATURES
  const auditlogs = await getAuditLogs(channel.guildID, {
    action_type: type === "create" ? "CHANNEL_CREATE" : type === "delete" ? "CHANNEL_DELETE" : "CHANNEL_UPDATE",
  }).catch(console.log);

  const relevant = auditlogs?.audit_log_entries?.find((log: any) => log.target_id === channel.id);
  if (!relevant) return sendEmbed(logChannelID, embed);

  const user = auditlogs.users.find((u: any) => u.id === relevant.user_id);
  if (user) {
    const nick = cache.members.get(user.id)?.guilds.get(channel.guildID)?.nick;
    const finalNick = nick ? ` (${nick})` : "";
    embed.setAuthor(
      `${user.username}#${user.discriminator}${finalNick}`,
      rawAvatarURL(user.id, user.discriminator, user.avatar)
    );
  }

  if (type === "create" && relevant.changes?.length) {
    const permissions = relevant.changes.find((c: any) => c.key === "permission_overwrites");
    if (permissions) {
      for (const perm of permissions.new_value) {
        const allow = calculatePermissions(BigInt(perm.allow)).map((p) => `${p} ${botCache.constants.emojis.success}`);
        const deny = calculatePermissions(BigInt(perm.deny)).map((p) => `${p} ${botCache.constants.emojis.failure}`);

        if (allow.length || deny.length) {
          texts.push(
            [
              perm.type === OverwriteType.ROLE ? `<@&${perm.id}>` : `<@!${perm.id}>`,
              ...allow.map((p) => botCache.helpers.toTitleCase(p.replaceAll("_", " "))),
              ...deny.map((p) => botCache.helpers.toTitleCase(p.replaceAll("_", " "))),
            ].join(" ")
          );
          embed.setDescription(texts.join("\n"));
        }
      }
    }
  }

  return sendEmbed(logChannelID, embed);
}

async function handleMuteRole(channel: Channel, settings: GuildSchema, botsRoleID: string) {
  const role = channel.guild?.roles.get(settings.muteRoleID);
  if (!role || !(await higherRolePosition(channel.guildID, role.id, botsRoleID))) {
    return;
  }

  await editChannel(channel.id, {
    overwrites: [
      ...(channel.permissionOverwrites || []).map((o) => ({
        id: o.id,
        type: o.type,
        allow: calculatePermissions(BigInt(o.allow)),
        deny: calculatePermissions(BigInt(o.deny)),
      })),
      {
        id: role.id,
        allow: [],
        deny: ["VIEW_CHANNEL"],
        type: OverwriteType.ROLE,
      },
    ],
  }).catch(console.log);
}

async function handleVerifyRole(channel: Channel, settings: GuildSchema, botsRoleID: string) {
  const role = channel.guild?.roles.get(settings.verifyCategoryID);
  if (!role || !(await higherRolePosition(channel.guildID, role.id, botsRoleID))) {
    return;
  }

  await editChannel(channel.id, {
    overwrites: [
      ...(channel.permissionOverwrites || []).map((o) => ({
        id: o.id,
        type: o.type,
        allow: calculatePermissions(BigInt(o.allow)),
        deny: calculatePermissions(BigInt(o.deny)),
      })),
      {
        id: role.id,
        allow: [],
        deny: ["VIEW_CHANNEL"],
        type: OverwriteType.ROLE,
      },
    ],
  }).catch(console.log);
}
