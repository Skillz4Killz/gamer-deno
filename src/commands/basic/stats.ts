import { Embed } from "./../../utils/Embed.ts";
import { botCache, cache } from "../../../deps.ts";
import {
  createCommand,
  humanizeMilliseconds,
  sendEmbed,
} from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";
import { dispatched } from "../../events/dispatchRequirements.ts";

const UPTIME = Date.now();

createCommand({
  name: `stats`,
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  guildOnly: true,
  execute: (message, _args) => {
    let totalMemberCount = 0;
    let cachedMemberCount = 0;

    for (const guild of cache.guilds.values()) {
      totalMemberCount += guild.memberCount;
    }

    for (const member of cache.members.values()) {
      cachedMemberCount += member.guilds.size;
    }

    const commands = botCache.commands.reduce(
      (subtotal, command) => subtotal + 1 + (command.subcommands?.size || 0),
      0,
    );

    const embed = new Embed()
      .setTitle(translate(message.guildID, "strings:BOT_STATS"))
      .setColor("random")
      .addField(
        translate(message.guildID, "strings:SERVERS"),
        (cache.guilds.size + dispatched.guilds.size).toLocaleString(),
        true,
      )
      .addField(
        translate(message.guildID, "strings:MEMBERS"),
        totalMemberCount.toLocaleString(),
        true,
      )
      .addField(
        translate(message.guildID, "strings:CHANNELS"),
        (cache.channels.size + dispatched.channels.size).toLocaleString(),
        true,
      )
      .addField(
        translate(message.guildID, "strings:UPTIME"),
        humanizeMilliseconds(Date.now() - UPTIME),
        true,
      )
      .addField(
        translate(message.guildID, "strings:COMMANDS"),
        commands.toLocaleString(),
        true,
      )
      .setTimestamp();

    sendEmbed(message.channelID, embed);
  },
});
