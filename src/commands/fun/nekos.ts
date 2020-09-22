import { botCache } from "../../../mod.ts";
import type { sendMessage, avatarURL } from "../../../deps.ts";
import type { Embed } from "../../utils/Embed.ts";
import type { sendEmbed } from "../../utils/helpers.ts";

const nekosEndpoints = [
  { name: "tickly", path: "/img/tickle", nsfw: false },
  { name: "slap", path: "/img/slap", nsfw: false },
  { name: "pokey", path: "/img/poke", nsfw: false },
  { name: "paty", path: "/img/pat", nsfw: false },
  { name: "neko", path: "/img/neko", nsfw: false },
  { name: "meow", path: "/img/meow", nsfw: false },
  { name: "lizard", path: "/img/lizard", nsfw: false },
  { name: "kissy", path: "/img/kiss", nsfw: false },
  { name: "huggy", path: "/img/hug", nsfw: false },
  { name: "foxGirl", path: "/img/fox_girl", nsfw: false },
  { name: "feed", path: "/img/feed", nsfw: false },
  { name: "cuddly", path: "/img/cuddle", nsfw: false },
  { name: "why", path: "/why", nsfw: false },
  { name: "catText", path: "/cat", nsfw: false },
  { name: "OwOify", path: "/owoify", nsfw: false },
  { name: "8Ball", path: "/8ball", nsfw: false },
  { name: "fact", path: "/fact", nsfw: false },
  { name: "nekoGif", path: "/img/ngif", nsfw: false },
  { name: "kemonomimi", path: "/img/kemonomimi", nsfw: false },
  { name: "holo", path: "/img/holo", nsfw: false },
  { name: "smug", path: "/img/smug", nsfw: false },
  { name: "baka", path: "/img/baka", nsfw: false },
  { name: "woof", path: "/img/woof", nsfw: false },
  { name: "spoiler", path: "/spoiler", nsfw: false },
  { name: "wallpaper", path: "/img/wallpaper", nsfw: false },
  { name: "goose", path: "/img/goose", nsfw: false },
  { name: "gecg", path: "/img/gecg", nsfw: false },
  { name: "avatary", path: "/img/avatar", nsfw: false },
  { name: "waifu", path: "/img/waifu", nsfw: false },
  { name: "randomHentaiGif", path: "/img/Random_hentai_gif", nsfw: true },
  { name: "pussy", path: "/img/pussy", nsfw: true },
  { name: "neko", path: "/img/nsfw_neko_gif", nsfw: true },
  { name: "nekoi", path: "/img/lewd", nsfw: true },
  { name: "nekoero", path: "/img/eron", nsfw: true },
  { name: "lesbian", path: "/img/les", nsfw: true },
  { name: "kuni", path: "/img/kuni", nsfw: true },
  { name: "cumsluts", path: "/img/cum", nsfw: true },
  { name: "classic", path: "/img/classic", nsfw: true },
  { name: "boobs", path: "/img/boobs", nsfw: true },
  { name: "bj", path: "/img/bj", nsfw: true },
  { name: "anal", path: "/img/anal", nsfw: true },
  { name: "avatarnsfw", path: "/img/nsfw_avatar", nsfw: true },
  { name: "yuri", path: "/img/yuri", nsfw: true },
  { name: "yuriero", path: "/img/eroyuri", nsfw: true },
  { name: "trap", path: "/img/trap", nsfw: true },
  { name: "tits", path: "/img/tits", nsfw: true },
  { name: "solo", path: "/img/solog", nsfw: true },
  { name: "soloi", path: "/img/solo", nsfw: true },
  { name: "pussy", path: "/img/pwankg", nsfw: true },
  { name: "pussyi", path: "/img/pussy_jpg", nsfw: true },
  { name: "kemonomimi", path: "/img/lewdkemo", nsfw: true },
  { name: "kemonomimiero", path: "/img/erokemo", nsfw: true },
  { name: "kitsune", path: "/img/lewdk", nsfw: true },
  { name: "kitsuneero", path: "/img/erok", nsfw: true },
  { name: "keta", path: "/img/keta", nsfw: true },
  { name: "holo", path: "/img/hololewd", nsfw: true },
  { name: "holoe", path: "/img/holoero", nsfw: true },
  { name: "hentai", path: "/img/hentai", nsfw: true },
  { name: "futanari", path: "/img/futanari", nsfw: true },
  { name: "femdom", path: "/img/femdom", nsfw: true },
  { name: "feet", path: "/img/feetg", nsfw: true },
  { name: "feetero", path: "/img/erofeet", nsfw: true },
  { name: "feeti", path: "/img/feet", nsfw: true },
  { name: "ero", path: "/img/ero", nsfw: true },
  { name: "cumi", path: "/img/cum_jpg", nsfw: true },
  { name: "blowjob", path: "/img/blowjob", nsfw: true },
  { name: "spank", path: "/img/spank", nsfw: true },
  { name: "gasm", path: "/img/gasm", nsfw: true },
];

nekosEndpoints.forEach((endpoint) => {
  botCache.commands.set(endpoint.name, {
    name: endpoint.name,
    nsfw: endpoint.nsfw,
    botChannelPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    execute: async function (message) {
      const url = `https://nekos.life/api/v2${endpoint.path}`;
      const result = await fetch(url).then((res) => res.json());

      const member = message.member();
      if (!member) return sendMessage(message.channelID, result?.url);

      const embed = new Embed()
        .setAuthor(member?.tag || message.author.username, avatarURL(member))
        .setImage(result?.url || "")
        .setTimestamp();

      return sendEmbed(message.channelID, embed);
    },
  });
});
