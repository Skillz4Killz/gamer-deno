import { botCache, cache } from "../../deps.ts";

botCache.arguments.set("...emojis", {
  name: "...emojis",
  execute: async function (_argument, parameters, message) {
    if (!parameters.length) return;

    const emojis = parameters.map((e) =>
      e.startsWith("<:") || e.startsWith("<a:") ? e.substring(e.lastIndexOf(":") + 1, e.length - 1) : e
    );

    return emojis
      .map((emoji) => {
        if (botCache.constants.emojis.defaults.has(emoji)) return emoji;

        let guildEmoji = cache.guilds.get(message.guildID)?.emojis.find((e) => e.id === emoji);
        if (!guildEmoji) {
          for (const guild of cache.guilds.values()) {
            const globalemoji = guild.emojis.find((e) => e.id === emoji);
            if (!globalemoji?.id) continue;

            guildEmoji = globalemoji;
            break;
          }
        }

        // @ts-ignore
        return botCache.helpers.emojiUnicode(guildEmoji);
      })
      .filter((e) => e);
  },
});
