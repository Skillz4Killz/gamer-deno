import {
  botCache,
  getAuditLogs,
  Guild,
  rawAvatarURL,
  UserPayload,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { translate } from "../utils/i18next.ts";
import { sendEmbed } from "../utils/helpers.ts";

botCache.eventHandlers.guildBanAdd = async function (guild, user) {
  handleBanServerLogs(guild, user, "add");
};

botCache.eventHandlers.guildBanRemove = async (guild, user) => {
  handleBanServerLogs(guild, user, "remove");
};

async function handleBanServerLogs(
  guild: Guild,
  user: UserPayload,
  type: "add" | "remove",
) {
  const logs = botCache.recentLogs.get(guild.id) ||
    await db.serverlogs.get(guild.id);
  botCache.recentLogs.set(guild.id, logs);
  // LOGS ARE DISABLED
  if (!logs?.banAddChannelID) return;

  const userTag = `${user.username}#${user.discriminator}`;

  const texts = [
    translate(
      guild.id,
      type === "add" ? "strings:USER_BANNED" : "strings:USER_UNBANNED",
    ),
    translate(guild.id, "strings:USER", { tag: userTag, id: user.id }),
    translate(guild.id, "strings:TOTAL_USERS", { amount: guild.memberCount }),
  ];

  const embed = new Embed()
    .setDescription(texts.join("\n"))
    .setFooter(
      userTag,
      type === "add"
        ? botCache.constants.brand.BAN_IMAGE
        : botCache.constants.brand.UNBAN_IMAGE,
    )
    .setColor(
      type === "add" ? botCache.constants.brand.BAN_COLOR
      : botCache.constants.brand.UNBAN_COLOR,
    )
    .setThumbnail(rawAvatarURL(user.id, user.discriminator, user.avatar))
    .setTimestamp();

  // NO VIP GET BASIC DATA ONLY
  if (!botCache.vipGuildIDs.has(guild.id)) {
    return sendEmbed(
      type === "add" ? logs.banAddChannelID : logs.banRemoveChannelID,
      embed,
    );
  }

  // PUBLIC EMBED
  if (logs.banAddPublic) {
    sendEmbed(
      type === "add" ? logs.banAddChannelID : logs.banRemoveChannelID,
      embed,
    );
  }

  // WAIT FEW SECONDS TO ALLOW AUDIT LOGS AVAILABLE
  const auditlogs = await getAuditLogs(
    guild.id,
    { action_type: type === "add" ? "MEMBER_BAN_ADD" : "MEMBER_BAN_REMOVE" },
  ).catch(console.error);

  // IF A LOG WAS NOT FOUND, POST NORMAL EMBED
  const relevant = auditlogs?.audit_log_entries.find((e) =>
    e.target_id === user.id
  );
  if (!relevant) {
    return sendEmbed(
      type === "add" ? logs.banAddChannelID : logs.banRemoveChannelID,
      embed,
    );
  }

  // OLD BAN
  if (Date.now() - botCache.helpers.snowflakeToTimestamp(relevant.id) > 3000) return sendEmbed(
    type === "add" ? logs.banAddChannelID : logs.banRemoveChannelID,
    embed,
  );

  const mod = auditlogs.users.find((u) => u.id === relevant.user_id);
  if (mod) {
    embed.setAuthor(
      `${mod.username}#${mod.discriminator} (${mod.id})`,
      rawAvatarURL(mod.id, mod.discriminator, mod.avatar),
    );
  }
  if (relevant.reason) {
    texts.push(
      translate(guild.id, "strings:REASON", { reason: relevant.reason }),
    );
  }

  embed.setDescription(texts.join("\n"));

  return sendEmbed(
    type === "add" ? logs.banAddChannelID : logs.banRemoveChannelID,
    embed,
  );
}
