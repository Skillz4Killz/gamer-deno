import { botCache } from "../../../../deps.ts";

botCache.constants.gacha = {
  zooba: {
    characters: [
      {
        id: 1,
        rarity: 2,
        name: "Fuzzy: Frosty Strafer",
        emoji: "<:xyz:12345>",
        image: "https://i.imgur.com/YO8Qk8U.png",
        type: "Ice",
        description: "Fuzzy is a male penguin.",
        itemsEquipped: ["hatr", "sn", "nisp", "fire"],
        skinEquipped: "None",
        minHealth: 685,
        minHealthRegen: 2.18,
        minEnergy: 400,
        minEnergyRegen: 2.67,
        minBasicAttack: 75,
        minAttackSpeed: 100,
        minArmor: 25,
        minShield: 20,
        maxHealth: 2308,
        maxHealthRegen: 5.04,
        maxEnergy: 785,
        maxEnergyRegen: 5.2,
        maxBasicAttack: 117,
        maxAttackSpeed: 122,
        maxArmor: 75,
        maxShield: 55,
      },
    ],
    items: [
      {
        id: 2,
        rarity: 2,
        name: "hatr",
        emoji: "<:xyz:12345>",
        health: 0,
        healthRegen: 0,
        energy: 0,
        energyRegen: 0,
        basicAttack: 0,
        attackSpeed: 0,
        armor: 25,
        shield: 20,
      },
    ],
    abilities: [
      {
        id: 3,
        rarity: 2,
        name: "Achilles Shot",
        description: "Fires a trick shot at his target, slowing the enemy and dealing damage.",
        emoji: ":xyz:12345",
        minCooldown: "9s",
        minEnergyCost: 40,
        minDamage: 80,
        minAttackSpeed: 30,
        minDuration: "2s",
        maxCooldown: "9s",
        maxEnergyCost: 40,
        maxDamage: 80,
        maxAttackSpeed: 30,
        maxDuration: "2s",
      },
    ],
  },
  foods: [
    {
      id: 4,
      name: "Chocolate",
      experience: 1,
      rarity: 1,
      emoji: "",
      description: "",
    },
  ],
  rarities: {
    1: "Normal",
    2: "Rare",
    3: "Epic",
    4: "Legendary",
    5: "Mythical",
  },
};
