import { botCache } from "../../deps.ts";
import { cache } from "../../deps.ts";

botCache.arguments.set("emoji", {
  name: "emoji",
  execute: async function (_argument, parameters, message) {
    let [id] = parameters;
    if (!id) return;

    if (botCache.constants.emojis.defaults.has(id)) return id;

    if (id.startsWith("<:")) {
      id = id.substring(id.lastIndexOf(":"), id.length - 1);
    }


    const emoji = cache.guilds.get(message.guildID)?.emojis.find((e) =>
      e.id === id
    );
    if (emoji) return;

    // @ts-ignore
    return botCache.helpers.emojiUnicode(emoji);
  },
});
