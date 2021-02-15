import { botCache, Collection } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("gacha", {
  name: "summon",
  arguments: [{ name: "amount", type: "number", defaultValue: 1 }] as const,
  cooldown: {
    seconds: 30,
    allowedUses: 2,
  },
  execute: async function (message, args) {
    // Only vip users can summon more than 1 at a time
    if (args.amount > 1 && !botCache.vipUserIDs.has(message.author.id)) {
      return botCache.helpers.reactError(message, true);
    }

    const profile = await db.gachas.get(message.author.id);
    // Handle first time user
    if (!profile) {
      await db.gachas.create(message.author.id, {
        ownedCharacters: [
          {
            // Give the user the base character for free
            id: 1,
            experience: 0,
            skin: 0,
          },
        ],
        ownedItems: [],
        ownedAbilities: [],
        // Give the user 25 free gachas
        gachas: 25,
        // Free starting food, 25 free food # 1
        foods: [...Array(25).keys()].map(() => 1),
      });

      // Respond cancelling out, letting the user know they unlocked their first rewards.
      return message.reply(
        [
          translate(message.guildID, "strings:GACHA_FIRST_1"),
          translate(message.guildID, "strings:GACHA_FIRST_2"),
          translate(message.guildID, "strings:GACHA_FIRST_3"),
          translate(message.guildID, "strings:GACHA_FIRST_4", {
            invite: botCache.constants.botSupportInvite,
          }),
        ].join("\n")
      );
    }

    const settings = await db.users.get(message.author.id);
    if (!settings) return botCache.helpers.reactError(message);

    // Pick a random character/item/skin/food
    const abilities = [...botCache.constants.gacha.zooba.abilities];
    const characters = [...botCache.constants.gacha.zooba.characters];
    const items = [...botCache.constants.gacha.zooba.items];
    const foods = [...botCache.constants.gacha.foods];

    const all = [...abilities, ...characters, ...items, ...foods];
    const everything = all.map((x) => [x.id, x.rarity]);

    const lootbox = new Collection<number, number>();

    // Counter will make sure everything is unique
    let counter = 0;

    for (const item of everything) {
      // For all items, loop based on the rarity;
      for (let i = 0; i < Math.ceil(5 / item[1]); i++) {
        lootbox.set(counter, item[0]);
        counter++;
      }
    }

    const loot = new Collection<number, number>();

    for (let i = 0; i < args.amount; i++) {
      // Check if the user can afford this
      if (!profile.gachas) continue;

      // Pick a random item from the lootbox
      const unlockedID = lootbox.random();

      // If this was already picked add 1 else set to 1 won
      const current = loot.get(unlockedID) || 0;
      loot.set(unlockedID, current + 1);
    }

    // Update the db
    await db.gachas.update(message.author.id, {
      ownedAbilities: [...profile.ownedAbilities, ...loot.filter((i) => abilities.some((e) => e.id === i)).values()],
      ownedCharacters: [
        ...profile.ownedCharacters,
        ...loot
          .filter((i) => characters.some((e) => e.id === i))
          .map((i) => ({
            id: i,
            experience: 0,
            skin: 0,
          })),
      ],
      ownedItems: [...profile.ownedItems, ...loot.filter((i) => items.some((e) => e.id === i)).values()],
      foods: [...profile.foods, ...loot.filter((i) => foods.some((e) => e.id === i)).values()],
    });

    // Send to the user the rewards they won
    const texts = loot.map((id) => {
      const prize = all.find((i) => i.id === id);
      if (!prize) return "";

      return `${prize.emoji} **${prize.name}** ${botCache.constants.gacha.rarities[prize.rarity]}`;
    });

    const responses = botCache.helpers.chunkStrings(texts);

    for (const response of responses) {
      await message.reply(response).catch(console.log);
    }
  },
});
