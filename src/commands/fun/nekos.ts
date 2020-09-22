import { sendMessage } from "../../../deps.ts";
import { Embed } from "../../utils/Embed.ts";
import { createCommand, sendEmbed } from "../../utils/helpers.ts";

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
];

nekosEndpoints.forEach((endpoint) => {
  createCommand({
    name: endpoint.name,
    nsfw: endpoint.nsfw,
    botChannelPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    execute: async function (message, args, guild) {
      const url = `https://nekos.life/api/v2${endpoint.path}`;
      const result = await fetch(url).then((res) => res.json());

      const member = guild?.members.get(message.author.id);
      if (!member) return sendMessage(message.channelID, result?.url);

      const embed = new Embed()
        .setAuthor(member?.tag || message.author.username, member.avatarURL)
        .setImage(result?.url || "")
        .setTimestamp();

      return sendEmbed(message.channelID, embed);
    },
  });
});
