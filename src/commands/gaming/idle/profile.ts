import { botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand, sendEmbed } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("idle", {
  name: "profile",
  aliases: ["p"],
  cooldown: {
    seconds: 120,
    allowedUses: 25,
  },
  execute: async function (message) {
    const profile = await db.idle.get(message.author.id);
    if (!profile) return botCache.helpers.reactError(message);

    const embed = botCache.helpers
      .authorEmbed(message)
      .setDescription(
        [
          `**${botCache.helpers.cleanNumber(profile.currency)}** 💵`,
          botCache.helpers.shortNumber(BigInt(profile.currency).toLocaleString("en-US")),
        ].join("\n")
      )
      .addField(
        "Friends",
        [
          translate(message.guildID, "strings:CURRENT_LEVEL", {
            amount: botCache.helpers.cleanNumber(profile.friends),
          }),
          translate(message.guildID, "strings:CURRENT_MULTIPLIER", {
            amount: botCache.constants.idle.engine.calculateMultiplier(profile.friends),
          }),
        ].join("\n"),
        true
      );

    const items = [
      { item: profile.friends, next: "Servers", upcoming: profile.servers },
      { item: profile.servers, next: "Channels", upcoming: profile.channels },
      { item: profile.channels, next: "Roles", upcoming: profile.roles },
      { item: profile.roles, next: "Perms", upcoming: profile.perms },
      { item: profile.perms, next: "Messages", upcoming: profile.messages },
      { item: profile.messages, next: "Invites", upcoming: profile.invites },
      { item: profile.invites, next: "Bots", upcoming: profile.bots },
      { item: profile.bots, next: "Hypesquads", upcoming: profile.hypesquads },
      { item: profile.hypesquads, next: "Nitro", upcoming: profile.nitro },
    ];

    for (const item of items) {
      embed.addField(
        `${item.item >= 25 ? item.next : "🔒"}`,
        [
          `${translate(message.guildID, "strings:CURRENT_LEVEL", {
            amount: botCache.helpers.cleanNumber(item.upcoming),
          })}`,
          item.item >= 25
            ? `${translate(message.guildID, "strings:CURRENT_MULTIPLIER", {
                amount: botCache.constants.idle.engine.calculateMultiplier(item.upcoming),
              })}`
            : "",
        ]
          .join("\n")
          .trim(),
        true
      );
    }

    const member = cache.members.get(profile.id);
    const isekai = cache.members.get("719912970829955094");
    const sharedGuilds = member?.guilds.filter((g, key) =>
      Boolean(isekai?.guilds.has(key) && profile.guildIDs.includes(key))
    );

    console.log("multi,", profile.guildIDs, sharedGuilds?.size);

    embed.addField(
      "Gamer Server Multiplier",
      (profile.guildIDs.length > 100 ? 100 : profile.guildIDs.length).toString()
    );
    embed.addField("Isekai Server Multiplier", (sharedGuilds?.size || 0).toString());

    await sendEmbed(message.channelID, embed);
  },
});
