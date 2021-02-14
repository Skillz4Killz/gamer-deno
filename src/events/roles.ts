import {
  botCache,
  getAuditLogs,
  Guild,
  rawAvatarURL,
  Role,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.roleCreate = async function (guild, role) {
  handleServerLog(guild, role, "created").catch(console.log);
};

botCache.eventHandlers.roleDelete = async function (guild, role) {
  handleServerLog(guild, role, "deleted").catch(console.log);
};

async function handleServerLog(
  guild: Guild,
  role: Role,
  type: "created" | "deleted"
) {
  const texts = [
    translate(
      guild.id,
      type === "created" ? "strings:ROLE_CREATED" : "strings:ROLE_DELETED",
      { name: `<@&${role.id}> - **${role.name}**`, id: role.id }
    ),
    translate(guild.id, "strings:TOTAL_ROLES", { amount: guild.roles.size }),
    translate(guild.id, "strings:LOGS_MENTIONABLE", {
      value: botCache.helpers.booleanEmoji(role.mentionable),
    }),
    translate(guild.id, "strings:HOISTED", {
      value: botCache.helpers.booleanEmoji(role.hoist),
    }),
    translate(guild.id, "strings:POSITION", { value: role.position }),
  ];
  // Create the base embed that first can be sent to public logs
  const embed = new Embed()
    .setDescription(texts.join("\n"))
    .setFooter(
      role.name,
      type === "created"
        ? `https://i.imgur.com/Ya0SXdI.png`
        : "https://i.imgur.com/iZPBVKB.png"
    )
    .setThumbnail(
      type === "created"
        ? `https://i.imgur.com/Ya0SXdI.png`
        : "https://i.imgur.com/iZPBVKB.png"
    )
    .setTimestamp();

  const logs = botCache.recentLogs.has(guild.id)
    ? botCache.recentLogs.get(guild.id)
    : await db.serverlogs.get(guild.id);

  botCache.recentLogs.set(guild.id, logs);

  if (!logs) return;
  if (type === "created" && !logs.roleCreateChannelID) return;
  if (type === "deleted" && !logs.roleDeleteChannelID) return;

  if (botCache.vipGuildIDs.has(guild.id)) {
    if (
      (type === "created" && logs.roleCreatePublic) ||
      (type === "deleted" && logs.roleDeletePublic)
    ) {
      await sendEmbed(logs.publicChannelID, embed);
    }
  }

  const auditlogs = await getAuditLogs(guild.id, {
    action_type: type === "created" ? "ROLE_CREATE" : "ROLE_DELETE",
  }).catch(console.log);
  const relevant = auditlogs?.audit_log_entries?.find(
    (e: any) => e.target_id === role.id
  );
  if (!relevant) {
    return sendEmbed(
      type === "created" ? logs.roleCreateChannelID : logs.roleDeleteChannelID,
      embed
    );
  }

  const mod = auditlogs.users.find((u: any) => u.id === relevant.user_id);
  if (mod) {
    embed.setAuthor(
      `${mod.username}#${mod.discriminator} (${mod.id})`,
      rawAvatarURL(mod.id, mod.discriminator, mod.avatar)
    );
  }
  if (relevant.reason) {
    texts.push(
      translate(guild.id, "strings:REASON", { reason: relevant.reason })
    );
  }

  embed.setDescription(texts.join("\n"));

  return sendEmbed(
    type === "created" ? logs.roleCreateChannelID : logs.roleDeleteChannelID,
    embed
  );
}
