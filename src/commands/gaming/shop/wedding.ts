import { botCache, chooseRandom } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand, sendResponse } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";
import { TenorGif } from "../../fun/fungifs.ts";

const searchCriteria = [
  { name: "wedding album", cost: 5 },
  { name: "wedding budget", cost: 10 },
  { name: "wedding party", cost: 10 },
  { name: "guest list", cost: 10 },
  { name: "planner", cost: 500 },
  { name: "wedding hall", cost: 1000 },
  { name: "gamer bot", cost: 10 },
  { name: "photographer", cost: 500 },
  { name: "engagement party", cost: 1000 },
  { name: "jesters", cost: 500 },
  { name: "caterers", cost: 500 },
  { name: "wedding dress", cost: 1000 },
  { name: "wedding website", cost: 100 },
  { name: "share social media", cost: 100 },
  { name: "pretty font", cost: 200 },
  { name: "vaccination shots", cost: 300 },
  { name: "bridesmaid's dresses.", cost: 1000 },
  { name: "wedding invitations", cost: 200 },
  { name: "wedding chairs", cost: 200 },
  { name: "florist", cost: 500 },
  { name: "limo", cost: 300 },
  { name: "dinner venue", cost: 500 },
  { name: "wedding cake", cost: 300 },
  { name: "wedding shoes", cost: 1000 },
  { name: "hair and makeup artists", cost: 500 },
  { name: "dj", cost: 500 },
  { name: "wedding ring", cost: 6000 },
  { name: "slow dance", cost: 1000 },
  { name: "slow dance", cost: 1000 },
  { name: "marriage license", cost: 20 },
  { name: "assigned seats", cost: 10 },
  { name: "bridesmaids gifts", cost: 500 },
  { name: "wedding vows", cost: 10 },
  { name: "haircut", cost: 20 },
  { name: "hair dye", cost: 20 },
  { name: "painful waxing", cost: 20 },
  { name: "dobby sock", cost: 1 },
];

createSubcommand("shop", {
  name: "wedding",
  guildOnly: true,
  execute: async function (message) {
    const marriage = await db.marriages.get(message.author.id);
    if (!marriage) {
      return sendResponse(
        message,
        translate(message.guildID, "strings:SHOP_WEDDING_NOT_MARRIED"),
      );
    }

    const item = searchCriteria[marriage.step];
    if (!item) {
      return sendResponse(
        message,
        translate(message.guildID, `strings:SHOP_WEDDING_COMPLETE`),
      );
    }

    // If no settings for the user they wont have any coins to spend anyway
    const userSettings = await db.users.get(message.author.id);
    if (!userSettings) {
      return sendResponse(
        message,
        translate(message.guildID, `strings:SHOP_WEDDING_NEED_COINS`, {
          emoji: botCache.constants.emojis.coin,
          cost: item.cost,
          needed: item.cost,
        }),
      );
    }

    if (userSettings.coins < item.cost) {
      // If not enough check if the marriage is accepted and combined the two users coins
      if (marriage.accepted) {
        const spouseSettings = await db.users.get(marriage.spouseID);
        if (!spouseSettings) return;

        if (userSettings.coins + spouseSettings.coins < item.cost) {
          return sendResponse(
            message,
            translate(message.guildID, `strings:SHOP_WEDDING_NEED_COINS`, {
              emoji: botCache.constants.emojis.coin,
              cost: item.cost,
              needed: item.cost -
                (userSettings.coins + spouseSettings.coins),
            }),
          );
        }

        // Update the users currency
        const leftover = item.cost - userSettings.coins;
        db.users.update(message.author.id, { coins: 0 });
        db.users.update(marriage.spouseID, { coins: leftover });
      } // Since the marriage hasnt been accepted yet we cancel out since the user doesnt have enough coins
      else {
        return sendResponse(
          message,
          translate(message.guildID, `strings:SHOP_WEDDING_NEED_COINS`, {
            emoji: botCache.constants.emojis.coin,
            cost: item.cost,
            needed: item.cost - userSettings.coins,
          }),
        );
      }
    } else {
      // The user has enough coins to buy this so just simply take the cost off
      db.users.update(
        message.author.id,
        { coins: userSettings.coins - item.cost },
      );
    }

    const SHOPPING_LIST: string[] = translate(
      message.guildID,
      "strings:SHOP_WEDDING_SHOPPING_LIST",
      {
        mention: `<@!${message.author.id}>`,
        coins: botCache.constants.emojis.coin,
        returnObjects: true,
      },
    );

    if (SHOPPING_LIST.length === marriage.step + 1) {
      return sendResponse(
        message,
        translate(message.guildID, "strings:SHOP_WEDDING_COMPLETE"),
      );
    }

    const shoppingList = SHOPPING_LIST.map(
      (i, index) =>
        `${index <= marriage.step ? `✅` : `📝`} ${index +
          1}. ${i} ${searchCriteria[index]
          ?.cost} ${botCache.constants.emojis.coin}`,
    );

    while (shoppingList.length > 3) {
      const secondItem = shoppingList[1];
      // If the second item is done the first will also be done so remove the first
      if (secondItem?.startsWith("✅")) {
        shoppingList.shift();
        continue;
      }

      // If there is only 1 check or less, remove the last item
      shoppingList.pop();
    }

    const embed = botCache.helpers.authorEmbed(message)
      .setDescription(shoppingList.join("\n"));

    if (!botCache.tenorDisabledGuildIDs.has(message.guildID)) {
      const data: TenorGif | undefined = await fetch(
        `https://api.tenor.com/v1/search?q=${item.name}&key=LIVDSRZULELA&limit=50`,
      )
        .then((res) => res.json())
        .catch(() => undefined);

      const randomResult = data?.results?.length
        ? chooseRandom(data.results)
        : undefined;
      const [media] = randomResult ? randomResult.media : [];
      if (media) embed.setImage(media.gif.url).setFooter(`Via Tenor`);
    }

    db.marriages.update(
      message.author.id,
      { step: marriage.step + 1, love: marriage.love + 1 },
    );
    if (marriage.accepted) {
      db.marriages.update(
        marriage.spouseID,
        { step: marriage.step + 1, love: marriage.love + 1 },
      );
    }

    sendResponse(message, { embed });
    if (marriage.step !== SHOPPING_LIST.length) return;

    sendResponse(
      message,
      [
        translate(
          message.guildID,
          `strings:SHOP_WEDDING_CONGRATS_1`,
          { mention: `<@!${message.author.id}>` },
        ),
        "",
        translate(message.guildID, `strings:SHOP_WEDDING_CONGRATS_2`),
        translate(message.guildID, `strings:SHOP_WEDDING_CONGRATS_3`),
      ].join("\n"),
    );

    // The shopping is complete
    const completedEmbed = botCache.helpers.authorEmbed(message)
      .setImage("https://i.imgur.com/Dx9Z2hq.jpg");
    return sendResponse(message, { embed: completedEmbed });
  },
});
