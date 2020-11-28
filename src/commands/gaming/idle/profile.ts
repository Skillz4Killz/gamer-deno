import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";

createSubcommand("idle", {
  name: "profile",
  aliases: ["p"],
  cooldown: {
    seconds: 120,
  },
  execute: async function (message) {
    const profile = await db.idle.get(message.author.id);
    if (!profile) return botCache.helpers.reactError(message);

    const embed = botCache.helpers.authorEmbed(message)
      .setDescription([
        `**${
          botCache.helpers.cleanNumber(
            BigInt(profile.currency).toLocaleString(),
          )
        }** 💵`,
        botCache.helpers.shortNumber(BigInt(profile.currency).toLocaleString()),
      ].join("\n"))
      .addField(" Friends", botCache.helpers.cleanNumber(profile.friends), true)
      .addField(
        `${profile.friends > 25 ? "Servers" : "🔒"}`,
        botCache.helpers.cleanNumber(profile.servers),
        true,
      )
      .addField(
        `${profile.servers > 25 ? "Channels" : "🔒"}`,
        botCache.helpers.cleanNumber(profile.channels),
        true,
      )
      .addField(
        `${profile.channels > 25 ? "Roles" : "🔒"}`,
        botCache.helpers.cleanNumber(profile.roles),
        true,
      )
      .addField(
        `${profile.roles > 25 ? "Perms" : "🔒"}`,
        botCache.helpers.cleanNumber(profile.perms),
        true,
      )
      .addField(
        `${profile.perms > 25 ? "Messages" : "🔒"}`,
        botCache.helpers.cleanNumber(profile.messages),
        true,
      )
      .addField(
        `${profile.messages > 25 ? "Invites" : "🔒"}`,
        botCache.helpers.cleanNumber(profile.invites),
        true,
      )
      .addField(
        `${profile.invites > 25 ? "Bots" : "🔒"}`,
        botCache.helpers.cleanNumber(profile.bots),
        true,
      )
      .addField(
        `${profile.bots > 25 ? "Hypesquads" : "🔒"}`,
        botCache.helpers.cleanNumber(profile.hypesquads),
        true,
      )
      .addField(
        `${profile.hypesquads > 25 ? "Nitro" : "🔒"}`,
        botCache.helpers.cleanNumber(profile.nitro),
        true,
      );

    sendEmbed(message.channelID, embed);
  },
});
