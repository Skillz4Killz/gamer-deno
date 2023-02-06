import { botCache, guildIconURL } from "../../deps.ts";
import { db } from "../database/database.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.eventHandlers.guildEmojisUpdate = async function (guild, emojis, cachedEmojis) {
  // IGNORE UPDATES
  if (emojis.length === cachedEmojis.length) return;

  const emojiCreated = emojis.length > cachedEmojis.length;
  // FINDS THE EMOJI THAT WAS ADDED OR REMOVED
  const emoji = emojiCreated
    ? emojis.find((e) => !cachedEmojis.some((em) => em.id === e.id))
    : cachedEmojis.find((e) => !emojis.some((em) => em.id === e.id));
  if (!emoji) return;

  // IF THE EMOJI WAS DELETED, DELELTE FROM OUR DB ALSO
  if (!emojiCreated && emoji.id) {
    await db.emojis.deleteOne({ emojiID: emoji.id });
  }

  // EMOJI URL MAY BE VALID AFTER DELETING FOR A BIT
  const emojiURL = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? `gif` : `png`}`;

  // DISABLED LOGS
  const logs = botCache.recentLogs.has(guild.id)
    ? botCache.recentLogs.get(guild.id)
    : await db.serverlogs.get(guild.id);
  botCache.recentLogs.set(guild.id, logs);

  if (!logs) return;
  if (emojiCreated && !logs.emojiCreateChannelID) return;
  if (!emojiCreated && !logs.emojiDeleteChannelID) return;

  const texts = [
    `[${translate(guild.id, emojiCreated ? "strings:EMOJI_CREATED" : "strings:EMOJI_DELETED")}](${emojiURL})`,
    translate(guild.id, "strings:NAME", { name: emoji.name }),
    translate(guild.id, "strings:ANIMATED", {
      value: botCache.helpers.booleanEmoji(emoji.animated!),
    }),
    translate(guild.id, "strings:TOTAL_EMOJIS", { amount: emojis.length }),
  ];

  const embed = new Embed()
    .setDescription(texts.join("\n"))
    .setFooter(emoji.name, guildIconURL(guild))
    .setThumbnail(emojiURL)
    .setTimestamp();

  // NO VIP GET THIS
  if (!botCache.vipGuildIDs.has(guild.id)) {
    return sendEmbed(emojiCreated ? logs.emojiCreateChannelID : logs.emojiDeleteChannelID, embed);
  }

  if (
    (botCache.vipGuildIDs.has(guild.id) && emojiCreated && logs.emojiCreatePublic) ||
    (!emojiCreated && logs.emojiDeletePublic)
  ) {
    await sendEmbed(logs.publicChannelID, embed);
  }

  return sendEmbed(emojiCreated ? logs.emojiCreateChannelID : logs.emojiDeleteChannelID, embed);
};
