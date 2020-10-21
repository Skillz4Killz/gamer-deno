import type { TenorGif } from "../commands/fun/fungifs.ts";

import { botCache } from "../../mod.ts";
import { guildIconURL } from "../../deps.ts";
import { db } from "../database/database.ts";

const REGEXP =
  /%AUTHOR%|%AUTHORMENTION%|%USER%|%GUILD%|%USERMENTION%|%USERCOUNT%|%MEMBERCOUNT%|%AUTHORIMAGE%|%USERIMAGE%|%GUILDIMAGE%/gi;

botCache.helpers.variables = async function (text, user, guild, author) {
  let fullContent = ``;

  const promises = text.split(` `).map(async (word) => {
    // User wants a random gif
    if (word.toUpperCase().startsWith("%RANDOM")) {
      const search = word.substring(7, word.length - 1);
      const res = await fetch(
        `https://api.tenor.com/v1/search?q=${
          search === "%" ? "random" : search
        }&key=LIVDSRZULELA&limit=50`,
      )
        .then((res) => res.json())
        .catch(() => undefined);
      if (!res) return word;

      if (!res.results.length) return word;
      const randomResult = botCache.helpers.chooseRandom(
        (res as TenorGif).results || [],
      );
      const [media] = randomResult.media;

      return media?.gif.url;
    }

    // User wants to use an emoji
    if (!word.startsWith("{") || !word.endsWith(`}`)) return word;

    const name = word.substring(1, word.length - 1);
    const foundEmoji = await db.emojis.get(name.toLowerCase());
    if (!foundEmoji) return word;

    return foundEmoji.fullCode;
  });

  const res = await Promise.all(promises);
  fullContent = res.join(` `);

  return fullContent.replace(REGEXP, (match) => {
    switch (match.toUpperCase()) {
      case `%AUTHOR%`:
        return author ? author.tag : ``;
      case `%AUTHORMENTION%`:
        return author ? author.mention : ``;
      case `%USER%`:
        return user ? user.mention : ``;
      case `%USERTAG%`:
        return user ? user.tag : ``;
      case `%USERID%`:
        return user ? user.id : ``;
      case `%GUILD%`:
        return guild ? guild.name : ``;
      case `%USERCOUNT%`:
      case `%MEMBERCOUNT%`:
        return guild ? guild.memberCount.toString() : ``;
      case `%USERMENTION%`:
        return user ? user.mention : ``;
      case `%AUTHORIMAGE%`:
        return author ? author.avatarURL : ``;
      case `%USERIMAGE%`:
        return user ? user.avatarURL : ``;
      case `%GUILDIMAGE%`:
        return guild ? guildIconURL(guild) || "" : ``;
      default:
        return match;
    }
  });
};
