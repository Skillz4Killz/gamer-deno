import { avatarURL, chooseRandom } from "../../../deps.ts";
import { botCache } from "../../../mod.ts";
import { sendResponse, sendEmbed } from "../../utils/helpers.ts";
import { Embed } from "../../utils/Embed.ts";
import { translate } from "../../utils/i18next.ts";

const gifData = [
  {
    name: "raphtalia",
    aliases: [],
    gifs: [
      "https://media1.tenor.com/images/f3ba711abc2538e7d48b1fada3d3a8c3/tenor.gif",
      "https://media1.tenor.com/images/c0e1b46577b048c4115e9e8d054f3b27/tenor.gif",
      "https://media1.tenor.com/images/71c5f8389fdd7af93ff3e8777c9b5390/tenor.gif",
      "https://media1.tenor.com/images/77f55584f081652d41de38dd3ae81abd/tenor.gif",
      "https://media1.tenor.com/images/01b43f936ed5c6218ef350462849b238/tenor.gif",
      "https://media1.tenor.com/images/186fb02a2164f37bc48b156e2f16f7ad/tenor.gif",
      "https://media1.tenor.com/images/f5558c996c5a4f0a97e5479992b284c9/tenor.gif",
      "https://media1.tenor.com/images/0444a1b1e7af31dde95dc67c44c18ce7/tenor.gif",
    ],
  },
  {
    name: "mavis",
    aliases: [],
    gifs: [
      "https://media1.tenor.com/images/33a468dc1c18433c7b2179cc09551e6b/tenor.gif",
      "https://media1.tenor.com/images/ab3ceecc5fd236edc48c0673d3ec5e07/tenor.gif",
      "https://media1.tenor.com/images/cfaed81d48574fe6e8155cfb82bcb939/tenor.gif",
      "https://media1.tenor.com/images/7fdcc0750a510f4c0e1e0f22c67f44eb/tenor.gif",
      "https://media1.tenor.com/images/4b4bdbf07ae2e3ad8309b78004989a5d/tenor.gif",
      "https://media1.tenor.com/images/8b3d0676fc41306f609de4e72f9c2e03/tenor.gif",
      "https://media1.tenor.com/images/43a482354ab244d0389b807f3cfd4dbe/tenor.gif",
      "https://media1.tenor.com/images/2267f0ce80742ed6be677c3124c1b137/tenor.gif",
      "https://media1.tenor.com/images/2860b1472546389ad0f28ba394aff77c/tenor.gif",
      "https://media1.tenor.com/images/859d8d48d7a2489be991d1f16445dd14/tenor.gif",
      "https://media1.tenor.com/images/e8597bdc08441ab29ea4ce3e8ef68194/tenor.gif",
      "https://media1.tenor.com/images/1377b64b722d2023610b81008695c507/tenor.gif",
    ],
  },
  {
    name: "lmao",
    aliases: ["lol", "laugh"],
    gifs: [
      "https://media.tenor.com/images/6a000fce3ccb8a452037a7650bc8059d/tenor.gif",
      "https://media.tenor.com/images/15e77aed58f4f90d4f93c11e5a5ab7d2/tenor.gif",
      "https://media.tenor.com/images/1e7ccca734b1852a167a7669ca90661e/tenor.gif",
      "https://media.tenor.com/images/139782aaec75983457b42e67707777bb/tenor.gif",
      "https://media.tenor.com/images/ec9641522eb7053bba1fe53da71393a2/tenor.gif",
      "https://media.tenor.com/images/d0a6ec93691184685efa5e1065ff7e6f/tenor.gif",
      "https://media.tenor.com/images/d9896297905b78522372dd5d079294a5/tenor.gif",
      "https://media.tenor.com/images/dc74818034bdeb1cb1c8c136fb675ecf/tenor.gif",
      "https://media.tenor.com/images/2183390c33417d017eaed6a53d80fb64/tenor.gif",
      "https://media.tenor.com/images/ed86290739a0121f7860c07e35852575/tenor.gif",
      "https://media.tenor.com/images/90fb36f29643556f4c03109eb97f1a7d/tenor.gif",
      "https://media.tenor.com/images/3df58c7a95d1f78054c33cd058418872/tenor.gif",
      "https://media.tenor.com/images/e82c2cd09db0bf410917cda2ef22ffd4/tenor.gif",
      "https://media.tenor.com/images/da6bada0c519d1934c9a81b945e4f989/tenor.gif",
      "https://media.tenor.com/images/a6772f352e53ede12cadbbcfd793c0b0/tenor.gif",
      "https://media.tenor.com/images/35ea53bbff3fc813f48cd979f71e6efe/tenor.gif",
      "https://media.tenor.com/images/4ebf8c4516b01f1cdfad3f355a804c39/tenor.gif",
      "https://media.tenor.com/images/621ffb137da9d9f8cc050bc108688939/tenor.gif",
      "https://media.tenor.com/images/630966f2d729c9c66a9bd25fda8cf4a0/tenor.gif",
      "https://media.tenor.com/images/a53be6cc904e63941709e5f7eae8f4e1/tenor.gif",
      "https://media.tenor.com/images/a322c03a94505b92e5e284e03ff0e3be/tenor.gif",
      "https://media.tenor.com/images/a50e887ed9c13b6eb5fca8bf3b8c95d4/tenor.gif",
      "https://media.tenor.com/images/b61b55887a9f82134e1534b0f8650eab/tenor.gif",
      "https://media.tenor.com/images/818f1b40a6b13377461548f84b2fc98b/tenor.gif",
      "https://media.tenor.com/images/270b2ef1070569dc44a100a9c18cdf63/tenor.gif",
      "https://media.tenor.com/images/ca5bd28dd76c4ea7e02172f0a6a035e6/tenor.gif",
      "https://media.tenor.com/images/808d871fbf7e5720169a33b808b5c3e0/tenor.gif",
      "https://media.tenor.com/images/01d5e4eedff5f8480f6f405f671d9479/tenor.gif",
      "https://media.tenor.com/images/e0e6ae3fffd22ed6cad22cce846cd966/tenor.gif",
      "https://media.tenor.com/images/b94138bf446b1062d64057e260be0e6a/tenor.gif",
      "https://media.tenor.com/images/2b34166f97e77eadbfdf8cd78ca7c5ce/tenor.gif",
      "https://media.tenor.com/images/ca85f7a5578b2cd14823d49fb7d217f2/tenor.gif",
      "https://media.tenor.com/images/3a8c2b86e9938ede7b202490e3102929/tenor.gif",
      "https://media.tenor.com/images/694357a89167bfb3511c58cd1926cc50/tenor.gif",
      "https://media.tenor.com/images/977f4473a86a40d39851fbeb24c20e23/tenor.gif",
      "https://media.tenor.com/images/eaf51280b8e17fca338f9f304a7acf5c/tenor.gif",
      "https://media.tenor.com/images/d787d33adb362e8a7cfe38aa37194c20/tenor.gif",
      "https://media.tenor.com/images/15bfdd85dd51fedc3542b48ac7d6c521/tenor.gif",
      "https://media.tenor.com/images/2d4935ac4f3a974a292630693404be69/tenor.gif",
      "https://media.tenor.com/images/7e29cd691708ff7a1052071c294136b7/tenor.gif",
      "https://media.tenor.com/images/960560ccf31b362c9ad8163d2a38ee7b/tenor.gif",
      "https://media.tenor.com/images/5a2524041fbb9f67c577ff4e1018745e/tenor.gif",
      "https://media.tenor.com/images/0bf3ff8a7b30da808a14e862b5fc9511/tenor.gif",
      "https://media.tenor.com/images/1bcacf02710dfba7fbc9a760a81a7eb0/tenor.gif",
      "https://media.tenor.com/images/934ccafbffa417cbbd00d0f81ea20376/tenor.gif",
      "https://media.tenor.com/images/027af2c70a60536a7d311e8b084a9ae7/tenor.gif",
    ],
    tenor: true,
  },
];

gifData.forEach((data) => {
  botCache.commands.set(data.name, {
    name: data.name,
    aliases: data.aliases,
    guildOnly: true,
    execute: async (message) => {
      // This command may require tenor.
      if (data.tenor) {
        const tenorData: TenorGif | undefined = await fetch(
          `https://api.tenor.com/v1/search?q=${data.name}&key=LIVDSRZULELA&limit=50`,
        )
          .then((res) => res.json())
          .catch(() => undefined);

        if (!tenorData || !tenorData.results?.length) {
          return botCache.helpers.reactError(message);
        }

        const randomResult = botCache.helpers.chooseRandom(tenorData.results);
        const [media] = randomResult.media;

        // If there is no member for whatever reason just send the gif without embed
        const member = message.member();
        if (!member) return sendResponse(message, media.gif.url);

        if (media) {
          // Create the embed
          const embed = new Embed()
            .setAuthor(member.nick || member.tag, avatarURL(member))
            .setImage(media.gif.url)
            .setFooter(translate(message.guildID, `common:TENOR`));

          // Send the embed to the channel
          return sendEmbed(message.channelID, embed);
        }
      }

      const randomGif = botCache.helpers.chooseRandom(data.gifs);

      // If there is no member for whatever reason just send the gif without embed
      const member = message.member();
      if (!member) return sendResponse(message, randomGif);

      // Create the embed
      const embed = new Embed()
        .setAuthor(member.nick || member.tag, avatarURL(member))
        .setImage(randomGif);

      // Send the embed to the channel
      sendEmbed(message.channelID, embed);
    },
  });
});

export interface TenorGif {
  weburl: string;
  results?: TenorGifData[];
}

export interface TenorGifData {
  tags: string[];
  url: string;
  media: Media[];
  created: number;
  shares: number;
  itemurl: string;
  composite: null;
  hasaudio: boolean;
  title: string;
  id: string;
}

export interface Media {
  nanomp4: MediaData;
  nanowebm: MediaData;
  tinygif: MediaData;
  tinymp4: MediaData;
  tinywebm: MediaData;
  webm: MediaData;
  gif: MediaData;
  mp4: MediaData;
  loopedmp4: MediaData;
  mediumgif: MediaData;
  nanogif: MediaData;
}

export interface MediaData {
  url: string;
  dims: number[];
  preview: string;
  size: number;
  duration?: number;
}
