import { botCache } from "../../cache.ts";
import { cache } from "../../deps.ts";

botCache.arguments.set("emoji", {
  name: "emoji",
  execute: async function (_argument, parameters, message) {
    let [id] = parameters;
    if (!id) return;

    if (botCache.constants.emojis.defaults.has(id)) return id;

    if (id.startsWith("<:")) {
      id = id.substring(2, id.length - 1);
    } else if (id.startsWith("<a:")) {
      id = id.substring(3, id.length - 1);
    }

    const emoji = cache.guilds.get(message.guildID)?.emojis.find((e) =>
      e.id === id
    );
    if (!emoji) return;

    // @ts-ignore
    return botCache.helpers.emojiUnicode(emoji);
  },
});
