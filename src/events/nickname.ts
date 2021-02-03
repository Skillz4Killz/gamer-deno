import { botCache, guildIconURL } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.nicknameUpdate = async function (
  guild,
  member,
  nick,
  oldNick,
) {
  // VIP ONLY STUFF
  if (!botCache.vipGuildIDs.has(guild.id)) return;

  const logs = botCache.recentLogs.has(guild.id)
    ? botCache.recentLogs.get(guild.id)
    : await db.serverlogs.get(guild.id);

  botCache.recentLogs.set(guild.id, logs);

  if (!logs?.memberNickChannelID) return;

  const texts = [
    translate(
      guild.id,
      "strings:MEMBER_UPDATED",
      { tag: member.tag, id: member.id },
    ),
    translate(
      guild.id,
      "strings:NICKNAME",
      { nickname: `${oldNick} **=>** ${nick}` },
    ),
  ];
  const embed = new Embed()
    .setDescription(texts.join("\n"))
    .setFooter(member.tag, guildIconURL(guild))
    .setThumbnail(member.avatarURL)
    .setTimestamp();

  // SEND NICK LOG TO PUBLIC
  if (logs.memberNickPublic) {
    await sendEmbed(logs.publicChannelID, embed);
  }
  // SEND PRIVATE NICK LOG
  return sendEmbed(logs.memberNickChannelID, embed);
};
