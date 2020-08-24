import { botCache } from "../../../mod.ts";
import { cache, sendMessage } from "../../../deps.ts";
import { translate } from "../../utils/i18next.ts";
import { Embed } from "../../utils/Embed.ts";
import { sendEmbed, createCommandAliases } from "../../utils/helpers.ts";

botCache.commands.set(`ping`, {
  name: `ping`,
  description: "commands/ping:DESCRIPTION",
  guildOnly: true,
  execute: function (message, args, guild) {
    const ping = Date.now() - message.timestamp;

    const embed = new Embed().setTitle(
      translate(
        message.guildID,
        `commands/ping:TIME`,
        { time: ping / 1000 },
      ),
    ).addField(
      translate(message.guildID, "commands/ping:STATS"),
      translate(message.guildID, `commands/ping:STATS_VALUE`, {
        id: guild?.shardID ?? "Unknown",
        discord: `:discord:`,
        guilds: cache.guilds.size.toLocaleString(),
        users: cache.guilds.reduce(
          (subtotal, guild) => subtotal + guild.memberCount,
          0,
        ).toLocaleString(),
      }),
    );

    return sendEmbed(message.channel, embed);
  },
});

createCommandAliases("ping", ["pong"]);
