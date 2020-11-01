import { botCache, cache, Channel } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("settings", {
  name: "autoreact",
  arguments: [
    { name: "channel", type: "guildtextchannel" },
    { name: "emojis", type: "...string" },
  ],
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async (message, args: SettingsAutoreactArgs, guild) => {
    const validEmojis: string[] = [];

    for (const emoji of args.emojis.split(" ")) {
      if (!emoji.startsWith("<")) continue;

      // If it is a custom emoji
      if (
        guild?.emojis.find((e) =>
          `<${e.animated ? "a" : ""}:${e.name}:${e.id}>` === emoji
        )
      ) {
        validEmojis.push(emoji);
        continue;
      }

      // Check all guilds emojis the bot shares
      for (const guild of cache.guilds.values()) {
        if (guild.id === message.guildID) continue;

        if (
          guild?.emojis.find((e) =>
            `<${e.animated ? "a" : ""}:${e.name}:${e.id}>` === emoji
          )
        ) {
          validEmojis.push(emoji);
          continue;
        }
      }
    }

    db.autoreact.create(args.channel.id, { reactions: validEmojis });

    botCache.helpers.reactSuccess(message);
  },
});

interface SettingsAutoreactArgs {
  channel: Channel;
  emojis: string;
}
