import { botCache, delay, deleteMessages } from "../../../deps.ts";
import { createCommand, sendEmbed } from "../../utils/helpers.ts";

const nekosEndpoints = [
  { name: "tickly", path: "/img/tickle" },
  { name: "backslap", path: "/img/slap" },
  { name: "pokey", path: "/img/poke" },
  { name: "paty", path: "/img/pat" },
  { name: "neko", path: "/img/neko" },
  { name: "meow", path: "/img/meow" },
  { name: "lizard", path: "/img/lizard" },
  { name: "kissy", path: "/img/kiss" },
  { name: "huggy", path: "/img/hug" },
  { name: "foxGirl", path: "/img/fox_girl" },
  { name: "feed", path: "/img/feed" },
  { name: "cuddly", path: "/img/cuddle" },
  { name: "why", path: "/why" },
  { name: "catText", path: "/cat" },
  { name: "OwOify", path: "/owoify" },
  { name: "fact", path: "/fact" },
  { name: "neko", path: "/img/ngif" },
  { name: "kemonomimi", path: "/img/kemonomimi" },
  { name: "holo", path: "/img/holo" },
  { name: "smug", path: "/img/smug" },
  { name: "baka", path: "/img/baka" },
  { name: "woof", path: "/img/woof" },
  { name: "spoiler", path: "/spoiler" },
  { name: "wallpaper", path: "/img/wallpaper" },
  { name: "goose", path: "/img/goose" },
  { name: "gecg", path: "/img/gecg" },
  { name: "avatary", path: "/img/avatar" },
  { name: "waifu", path: "/img/waifu" },
  // REAL NSFW
  { name: "hentaigif", path: "/img/Random_hentai_gif" },
  { name: "pussy", path: "/img/pussy" },
  { name: "nekogif", path: "/img/nsfw_neko_gif" },
  { name: "lewd", path: "/img/lewd" },
  { name: "lesbian", path: "/img/les" },
  { name: "kuni", path: "/img/kuni" },
  { name: "cumsluts", path: "/img/cum" },
  { name: "classic", path: "/img/classic" },
  { name: "boobs", path: "/img/boobs" },
  { name: "bj", path: "/img/bj" },
  { name: "anal", path: "/img/anal" },
  { name: "photo", path: "/img/nsfw_avatar" },
  { name: "yuri", path: "/img/yuri" },
  { name: "trap", path: "/img/trap" },
  { name: "tits", path: "/img/tits" },
  { name: "sologif", path: "/img/solog" },
  { name: "solo", path: "/img/solo" },
  { name: "wank", path: "/img/pwankg" },
  { name: "pussyart", path: "/img/pussy_jpg" },
  { name: "kemonomimi", path: "/img/lewdkemo" },
  { name: "kitsune", path: "/img/lewdk" },
  { name: "keta", path: "/img/keta" },
  { name: "holo", path: "/img/hololewd" },
  { name: "holoero", path: "/img/holoero" },
  { name: "hentai", path: "/img/hentai" },
  { name: "futanari", path: "/img/futanari" },
  { name: "femdom", path: "/img/femdom" },
  { name: "feetgif", path: "/img/feetg" },
  { name: "erofeet", path: "/img/erofeet" },
  { name: "feet", path: "/img/feet" },
  { name: "ero", path: "/img/ero" },
  { name: "erokitsune", path: "/img/erok" },
  { name: "erokemonomimi", path: "/img/erokemo" },
  { name: "eroneko", path: "/img/eron" },
  { name: "eroyuri", path: "/img/eroyuri" },
  { name: "cum", path: "/img/cum_jpg" },
  { name: "blowjob", path: "/img/blowjob" },
  { name: "spank", path: "/img/spank" },
  { name: "gasm", path: "/img/gasm" },
];

nekosEndpoints.forEach((endpoint) => {
  createCommand({
    name: endpoint.name,
    description: "strings:FUNGIFS_NEKO_DESCRIPTION",
    nsfw: true,
    botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    execute: async function (message) {
      const url = `https://nekos.life/api/v2${endpoint.path}`;
      const result = await fetch(url).then((res) => res.json());

      const embed = botCache.helpers.authorEmbed(message)
        .setColor("random")
        .setImage(result?.url || "")
        .setTimestamp();

      const response = await sendEmbed(message.channelID, embed);
      if (response) {
        await delay(botCache.constants.milliseconds.MINUTE);
        deleteMessages(message.channelID, [message.id, response.id]);
      }
    },
  });
});
