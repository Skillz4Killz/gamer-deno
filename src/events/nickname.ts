import { botCache, getAuditLogs, guildIconURL, rawAvatarURL } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.nicknameUpdate = async function (guild, member, nick, oldNick) {
  // VIP ONLY STUFF
  if (!botCache.vipGuildIDs.has(guild.id)) return;

  const logs = botCache.recentLogs.has(guild.id)
    ? botCache.recentLogs.get(guild.id)
    : await db.serverlogs.get(guild.id);

  botCache.recentLogs.set(guild.id, logs);

  if (!logs?.memberNickChannelID) return;

  const texts = [
    translate(guild.id, "strings:NICKNAME_UPDATED", {
      tag: member.tag,
      id: member.id,
    }),
    translate(guild.id, "strings:USER", {
      tag: `<@!${member.id}>`,
      id: member.id,
    }),
    translate(guild.id, "strings:OLD_NICKNAME", {
      nickname: oldNick ?? member.name(guild.id),
    }),
    translate(guild.id, "strings:NEW_NICKNAME", {
      nickname: nick ?? member.name(guild.id),
    }),
  ];
  const embed = new Embed()
    .setAuthor(member.tag, member.avatarURL)
    .setDescription(texts.join("\n"))
    .setFooter(member.tag, guildIconURL(guild))
    .setThumbnail(member.avatarURL)
    .setTimestamp();

  // SEND NICK LOG TO PUBLIC
  if (logs.memberNickPublic) {
    await sendEmbed(logs.publicChannelID, embed);
  }

  // WAIT FEW SECONDS TO ALLOW AUDIT LOGS AVAILABLE
  const auditlogs = await getAuditLogs(guild.id, {
    action_type: "MEMBER_UPDATE",
  }).catch(console.log);

  // IF A LOG WAS NOT FOUND, POST NORMAL EMBED
  const relevant = auditlogs?.audit_log_entries.find((e: any) => e.target_id === member.id);
  if (!relevant) {
    return sendEmbed(logs.memberNickChannelID, embed);
  }

  const mod = auditlogs.users.find((u: any) => u.id === relevant.user_id);
  if (mod) {
    embed.setAuthor(
      `${mod.username}#${mod.discriminator} (${mod.id})`,
      rawAvatarURL(mod.id, mod.discriminator, mod.avatar)
    );
  }

  // SEND PRIVATE NICK LOG
  return sendEmbed(logs.memberNickChannelID, embed);
};
