import { botCache, calculatePermissions, getAuditLogs, Guild, Message, rawAvatarURL, Role } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { permsToString, sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.roleCreate = async function (guild, role) {
  handleServerLog(guild, role, "created").catch(console.log);
};

botCache.eventHandlers.roleDelete = async function (guild, role) {
  handleServerLog(guild, role, "deleted").catch(console.log);
};

botCache.eventHandlers.roleUpdate = async function (guild, role, cachedRole) {
  handleServerLog(guild, role, "updated", cachedRole).catch(console.log);
};

async function handleServerLog(guild: Guild, role: Role, type: "updated", cachedRole: Role): Promise<void | Message>;
async function handleServerLog(guild: Guild, role: Role, type: "created" | "deleted"): Promise<void | Message>;
async function handleServerLog(guild: Guild, role: Role, type: "created" | "deleted" | "updated", cachedRole?: Role) {
  if (type === "updated") {
    // VIP ONLY STUFF
    if (!botCache.vipGuildIDs.has(guild.id)) return;
  }

  const logs = botCache.recentLogs.has(guild.id)
    ? botCache.recentLogs.get(guild.id)
    : await db.serverlogs.get(guild.id);

  botCache.recentLogs.set(guild.id, logs);

  if (!logs) return;
  if (type === "created" && !logs.roleCreateChannelID) return;
  if (type === "deleted" && !logs.roleDeleteChannelID) return;
  if (type === "updated" && !logs.roleUpdateChannelID) return;

  const texts = [
    translate(
      guild.id,
      type === "created" ? "strings:ROLE_CREATED" : type === "deleted" ? "strings:ROLE_DELETED" : "strings:ROLE_UPDATED"
    ),
    translate(guild.id, "strings:ROLE", {
      name: `<@&${role.id}> - **${role.name}**`,
      id: role.id,
    }),
  ];

  if (type !== "updated") {
    texts.push(
      translate(guild.id, "strings:TOTAL_ROLES", { amount: guild.roles.size }),
      translate(guild.id, "strings:LOGS_MENTIONABLE", {
        value: botCache.helpers.booleanEmoji(role.mentionable),
      }),
      translate(guild.id, "strings:HOISTED", {
        value: botCache.helpers.booleanEmoji(role.hoist),
      }),
      translate(guild.id, "strings:ROLE_MANAGED", {
        value: botCache.helpers.booleanEmoji(role.managed),
      }),
      translate(guild.id, "strings:ROLE_POSITION", { value: role.position }),
      translate(guild.id, "strings:ROLE_PERMISSIONS", {
        permissions: permsToString(calculatePermissions(BigInt(role.permissions))),
      })
    );
  } else {
    if (role.mentionable !== cachedRole?.mentionable) {
      texts.push(
        translate(guild.id, "strings:LOGS_MENTIONABLE", {
          value: botCache.helpers.booleanEmoji(role.mentionable),
        })
      );
    }

    if (role.hoist !== cachedRole?.hoist) {
      texts.push(
        translate(guild.id, "strings:HOISTED", {
          value: botCache.helpers.booleanEmoji(role.hoist),
        })
      );
    }

    if (role.position !== cachedRole?.position) {
      texts.push(
        translate(guild.id, "strings:ROLE_POSITION", {
          value: `${cachedRole?.position ?? "Unknown"} ➔ ${role.position}`,
        })
      );
    }

    if (role.permissions !== cachedRole?.permissions) {
      const newPerms = calculatePermissions(BigInt(role.permissions));
      const oldPerms = calculatePermissions(BigInt(cachedRole?.permissions));

      const addedPerms = newPerms.filter((p) => !oldPerms.includes(p));
      const removedPerms = oldPerms.filter((p) => !newPerms.includes(p));

      if (addedPerms.length) {
        texts.push(translate(guild.id, "strings:ROLE_PERMISSIONS_ADDED", { permissions: permsToString(addedPerms) }));
      }
      if (removedPerms.length) {
        texts.push(
          translate(guild.id, "strings:ROLE_PERMISSIONS_REMOVED", { permissions: permsToString(removedPerms) })
        );
      }
    }
  }

  // Create the base embed that first can be sent to public logs
  const embed = new Embed()
    .setAuthor(guild.name, guild.iconURL())
    .setColor(role.color.toString(16))
    .setDescription(texts.join("\n"))
    .setFooter(role.name, guild.iconURL())
    .setThumbnail(guild.iconURL() ?? "")
    .setTimestamp();

  // Non VIP get basic logs only
  if (!botCache.vipGuildIDs.has(guild.id)) {
    return sendEmbed(type === "created" ? logs.roleCreateChannelID : logs.roleDeleteChannelID, embed);
  }

  if (botCache.vipGuildIDs.has(guild.id)) {
    if (
      (type === "created" && logs.roleCreatePublic) ||
      (type === "deleted" && logs.roleDeletePublic) ||
      (type === "updated" && logs.roleUpdatePublic)
    ) {
      await sendEmbed(logs.publicChannelID, embed);
    }
  }

  const auditlogs = await getAuditLogs(guild.id, {
    action_type: type === "created" ? "ROLE_CREATE" : type === "deleted" ? "ROLE_DELETE" : "ROLE_UPDATE",
  }).catch(console.log);
  const relevant = auditlogs?.audit_log_entries?.find((e: any) => e.target_id === role.id);
  if (!relevant) {
    return sendEmbed(
      type === "created"
        ? logs.roleCreateChannelID
        : type === "deleted"
        ? logs.roleDeleteChannelID
        : logs.roleUpdateChannelID,
      embed
    );
  }

  const mod = auditlogs.users.find((u: any) => u.id === relevant.user_id);
  if (mod) {
    embed.setAuthor(
      `${mod.username}#${mod.discriminator} (${mod.id})`,
      rawAvatarURL(mod.id, mod.discriminator, mod.avatar)
    );
    embed.setThumbnail(rawAvatarURL(mod.id, mod.discriminator, mod.avatar));
  }
  if (relevant.reason) {
    texts.push(translate(guild.id, "strings:REASON", { reason: relevant.reason }));
  }

  embed.setDescription(texts.join("\n"));

  return sendEmbed(
    type === "created"
      ? logs.roleCreateChannelID
      : type === "deleted"
      ? logs.roleDeleteChannelID
      : logs.roleUpdateChannelID,
    embed
  );
}
