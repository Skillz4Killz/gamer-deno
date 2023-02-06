import { botCache } from "../../../../cache.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("gacha", {
  name: "feed",
  arguments: [
    { name: "food", type: "string", required: false, lowercase: true },
    { name: "foodID", type: "number", defaultValue: 1 },
    { name: "character", type: "string", required: false, lowercase: true },
    { name: "characterID", type: "number", defaultValue: 1 },
    { name: "amount", type: "number", defaultValue: 1 },
  ] as const,
  guildOnly: true,
  execute: async function (message, args) {
    const food = botCache.constants.gacha.foods.find((f) =>
      args.food ? f.name.toLowerCase() === args.food : f.id === args.foodID
    );
    if (!food) return botCache.helpers.reactError(message);

    const character = botCache.constants.gacha.zooba.characters.find((c) =>
      args.character ? c.name.toLowerCase().startsWith(args.character) : args.characterID === c.id
    );
    if (!character) return botCache.helpers.reactError(message);

    const settings = await db.gachas.get(message.author.id);
    if (!settings) return botCache.helpers.reactError(message);

    if (!settings.foods.includes(food.id)) {
      return botCache.helpers.reactError(message);
    }

    if (!settings.ownedCharacters.some((c) => c.id === character.id)) {
      return botCache.helpers.reactError(message);
    }

    let counter = 0;
    const leftoverFood: number[] = [];

    for (const id of settings.foods) {
      // ALREADY FINISHED ALL FOOD, SO ADD ALL REMAINING
      if (counter === args.amount) leftoverFood.push(id);
      // IF THIS IS NOT THE FOOD, KEEP IT
      if (food.id !== id) leftoverFood.push(id);
      else counter++;
    }

    await db.gachas.update(message.author.id, {
      foods: leftoverFood,
      ownedCharacters: settings.ownedCharacters.map((c) =>
        c.id === character.id ? { ...c, experience: c.experience + food.experience } : c
      ),
    });
  },
});
