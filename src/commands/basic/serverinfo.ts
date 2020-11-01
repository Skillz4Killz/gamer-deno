import { Embed } from "../../utils/Embed.ts";
import { getMember, guildIconURL, Member } from "../../../deps.ts";
import { createCommand, sendEmbed } from "../../utils/helpers.ts";
import { botCache } from "../../../cache.ts";
import { translate } from "../../utils/i18next.ts";

createCommand({
  name: `server`,
  aliases: ["serverinfo", "si"],
  guildOnly: true,
  execute: async (message, _args, guild) => {
    if (!guild) return;

    const owner = guild.members.get(guild.ownerID) ||
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
        translate(guild.id, "common:OWNER"),
        `${owner?.tag || translate(guild.id, "common:NOT_AVAILABLE")}`,
        true,
      )
      .addField(
        translate(guild.id, "common:CHANNELS"),
        guild.channels.size.toLocaleString(),
        true,
      )
      .addField(
        translate(guild.id, "common:MEMBERS"),
        guild.memberCount.toLocaleString(),
        true,
      )
      .addField(
        translate(guild.id, "common:ROLES"),
        guild.roles.size.toLocaleString(),
        true,
      )
      .addField(
        translate(guild.id, "common:LANGUAGE"),
        guild.preferredLocale,
        true,
      )
      .addField(
        translate(guild.id, "common:BOOSTS"),
        `${guild.premiumSubscriptionCount} ${botCache.constants.emojis.boosts}`,
        true,
      )
      .addField(
        translate(guild.id, "commands/server:MEMBERS_IN_VOICE"),
        guild.voiceStates.size.toLocaleString(),
        true,
      )
      .addField(
        translate(guild.id, "common:SHARD_ID"),
        guild.shardID.toLocaleString(),
        true,
      )
      .addField(
        translate(guild.id, "commands/server:SERVER_FEATURES"),
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
        embed.addField(translate(guild.id, "common:EMOJIS"), emojis);
      }
    }

    return sendEmbed(message.channelID, embed);
  },
});
