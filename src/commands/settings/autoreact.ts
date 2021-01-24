import { botCache, cache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("settings", {
  name: "autoreact",
  arguments: [
    { name: "channel", type: "guildtextchannel" },
    { name: "emojis", type: "...string" },
  ] as const,
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async (message, args, guild) => {
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

    await db.autoreact.create(
      args.channel.id,
      { id: args.channel.id, reactions: validEmojis, guildID: message.guildID },
    );
    botCache.autoreactChannelIDs.add(args.channel.id);

    await botCache.helpers.reactSuccess(message);
  },
});
