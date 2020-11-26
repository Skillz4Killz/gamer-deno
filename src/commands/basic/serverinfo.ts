import { Embed } from "../../utils/Embed.ts";
import { cache, getMember, guildIconURL, Member } from "../../../deps.ts";
import { createCommand, sendEmbed } from "../../utils/helpers.ts";
import { botCache } from "../../../cache.ts";
import { translate } from "../../utils/i18next.ts";

createCommand({
  name: `server`,
  aliases: ["serverinfo", "si"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  guildOnly: true,
  execute: async (message, _args, guild) => {
    if (!guild) return;

    const owner = cache.members.get(guild.ownerID) ||
      await getMember(guild.id, guild.ownerID).catch(() =>
        undefined
      ) as unknown as Member;

    let firstEmojis = "";
    let secondEmojis = "";
    let thirdEmojis = "";
    let fourthEmojis = "";

    for (
      const emoji of guild.emojis.sort((a, b) =>
        a.animated && !b.animated ? -1 : b.animated && !a.animated ? 1 : 0
      ).values()
    ) {
      const emojiName = `<${
        emoji.animated ? "a" : ""
      }:${emoji.name}:${emoji.id}>`;
      if (firstEmojis.length + emojiName.length < 1024) {
        firstEmojis += emojiName;
      } else if (secondEmojis.length + emojiName.length < 1024) {
        secondEmojis += emojiName;
      } else if (thirdEmojis.length + emojiName.length < 1024) {
        thirdEmojis += emojiName;
      } else if (fourthEmojis.length + emojiName.length < 1024) {
        fourthEmojis += emojiName;
      }
    }

    const embed = new Embed()
      .setAuthor(guild.name, guildIconURL(guild))
      .setThumbnail(guildIconURL(guild) || "")
      .addField(
        translate(guild.id, "strings:OWNER"),
        `${owner?.tag || translate(guild.id, "strings:NOT_AVAILABLE")}`,
        true,
      )
      .addField(
        translate(guild.id, "strings:CHANNELS"),
        cache.channels.filter((c) => c.guildID === message.guildID).size
          .toLocaleString(),
        true,
      )
      .addField(
        translate(guild.id, "strings:MEMBERS"),
        guild.memberCount.toLocaleString(),
        true,
      )
      .addField(
        translate(guild.id, "strings:ROLES"),
        guild.roles.size.toLocaleString(),
        true,
      )
      .addField(
        translate(guild.id, "strings:LANGUAGE"),
        guild.preferredLocale,
        true,
      )
      .addField(
        translate(guild.id, "strings:BOOSTS"),
        `${guild.premiumSubscriptionCount} ${botCache.constants.emojis.boosts}`,
        true,
      )
      .addField(
        translate(guild.id, "strings:MEMBERS_IN_VOICE"),
        guild.voiceStates.size.toLocaleString(),
        true,
      )
      .addField(
        translate(guild.id, "strings:SHARD_ID"),
        guild.shardID.toLocaleString(),
        true,
      )
      .addField(
        translate(guild.id, "strings:SERVER_FEATURES"),
        guild.features.map((feature) =>
          botCache.helpers.toTitleCase(feature.split("_").join(" "))
        ).join(
          ", ",
        ) || "None",
      )
      .setFooter(guild.id)
      .setTimestamp(botCache.helpers.snowflakeToTimestamp(guild.id));

    for (
      const emojis of [firstEmojis, secondEmojis, thirdEmojis, fourthEmojis]
    ) {
      if (emojis.length) {
        embed.addField(translate(guild.id, "strings:EMOJIS"), emojis);
      }
    }

    return sendEmbed(message.channelID, embed);
  },
});
