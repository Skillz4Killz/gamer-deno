import { Collection, Image } from "../../deps.ts";
import { IdleSchema } from "../database/schemas.ts";

export interface Constants {
  themes: Collection<string, Theme>;
  backgrounds: Background[];
  missions: Mission[];
  levels: Collection<number, { name: string; xpNeeded: number; id: number }>;
  idle: {
    boostEmoji: "💵";
    items: [
      "friends",
      "servers",
      "channels",
      "roles",
      "perms",
      "messages",
      "invites",
      "bots",
      "hypesquads",
      "nitro",
    ];
    constants: {
      friends: IdleItem;
      servers: IdleItem;
      channels: IdleItem;
      roles: IdleItem;
      perms: IdleItem;
      messages: IdleItem;
      invites: IdleItem;
      bots: IdleItem;
      hypesquads: IdleItem;
      nitro: IdleItem;
    };
    engine: {
      /** This function will be processing the amount of currency users have everytime they use a command to view their currency i imagine */
      process: (
        profile: IdleSchema,
      ) => { currency: bigint; lastUpdatedAt: number };
      calculateTotalProfit: (profile: IdleSchema) => bigint;
      calculateProfit: (
        level: number,
        baseProfit?: number,
        prestige?: number,
      ) => bigint;
      calculateUpgradeCost: (baseCost: number, level: number) => number;
      currentTitle: (
        type:
          | "friends"
          | "servers"
          | "channels"
          | "roles"
          | "perms"
          | "messages"
          | "invites"
          | "bots"
          | "hypesquads"
          | "nitro",
        level: number,
      ) => string;
      /** Takes the current user currency, the cost of the item, and how much currency the user is gaining per second and converts it to milliseconds until this item can be bought. */
      calculateMillisecondsTillBuyable: (
        currency: bigint,
        cost: bigint,
        perSecond: bigint,
      ) => bigint;
      /** Gets ms into human readable format like 1d5h3m2s */
      isEpicUpgrade: (level: number) => boolean;
    };
  };
  gacha: {
    zooba: {
      characters: GameCharacter[];
      items: GameItem[];
      abilities: GameAbility[];
    };
    foods: GameFood[];
    rarities: {
      [key: number]: string;
    };
  };
  profanity: {
    soft: string[];
    strict: string[];
  };
  alphabet: {
    english: {
      lowercase: string[];
      uppercase: string[];
    };
    russian: {
      lowercase: string[];
      uppercase: string[];
    };
  };
  counting: {
    shop: { id: number; type: "buff" | "debuff"; name: string; cost: number }[];
  };
  modlogs: {
    colors: {
      kick: string;
      ban: string;
      unban: string;
      warn: string;
      mute: string;
      unmute: string;
    };
    images: {
      kick: string;
      ban: string;
      unban: string;
      warn: string;
      mute: string;
      unmute: string;
    };
  };
  personalities: {
    id: string;
    name: string;
    names: string[];
  }[];
  milliseconds: {
    YEAR: number;
    MONTH: number;
    WEEK: number;
    DAY: number;
    HOUR: number;
    MINUTE: number;
    SECOND: number;
  };
  botLogos: string[];
  botSupportInvite: string;
  botInviteLink: string;
  botSupportServerID: string;
  emojis: {
    boosts: string;
    bot: string;
    colors: {
      red: string;
      purplered: string;
      purple: string;
      pinkpurple: string;
      pink: string;
      pedall: string;
      pastelyellow: string;
      pastelred: string;
      pastelpurple: string;
      pastelpink: string;
      pastelorange: string;
      pastelgreen: string;
      pastelblue: string;
      orange: string;
      limegreen: string;
      lightorange: string;
      lightblue: string;
      brown: string;
      brightyellow: string;
      brightpink: string;
      blue: string;
    };
    coin: string;
    defaults: Set<string>;
    failure: string;
    gamer: {
      hug: string;
      ban: string;
      warn: string;
      star: string;
    };
    numbers: string[];
    quit: string;
    success: string;
    todo: {
      current: "📌";
      next: "⏩";
      backlog: "🔖";
      completed: "✅";
      archived: "📥";
      delete: "🗑️";
    };
    voteup: string;
    votedown: string;
    mailbox: string;
    slam: string;
    snap: string;
    dab: string;
    gamerHug: string;
    gamerHeart: string;
    gamerOnFire: string;
    gamerCry: string;
    bite: string;
    pat: string;
    poke: string;
    lmao: string;
    tantrum: string;
    furious: string;
    hurray: string;
    heartthrob: string;
    starry: string;
    toastspinning: string;
    twohundretIQ: string;
    huh: string;
    Aquaaah: string;
    NezukoDance: string;
    RemDance: string;
    shrug: string;
  };
}

export interface GameItem {
  id: number;
  rarity: number;
  name: string;
  emoji: string;
  health: number;
  healthRegen: number;
  energy: number;
  energyRegen: number;
  basicAttack: number;
  attackSpeed: number;
  armor: number;
  shield: number;
}

export interface GameAbility {
  id: number;
  rarity: number;
  name: string;
  description: string;
  emoji: string;
  minCooldown: string;
  minEnergyCost: number;
  minDamage: number;
  minAttackSpeed: number;
  minDuration: string;
  maxCooldown: string;
  maxEnergyCost: number;
  maxDamage: number;
  maxAttackSpeed: number;
  maxDuration: string;
}

export interface GameCharacter {
  id: number;
  rarity: number;
  name: string;
  emoji: string;
  image: string;
  type: string;
  description: string;
  itemsEquipped: string[];
  skinEquipped: string;
  minHealth: number;
  minHealthRegen: number;
  minEnergy: number;
  minEnergyRegen: number;
  minBasicAttack: number;
  minAttackSpeed: number;
  minArmor: number;
  minShield: number;
  maxHealth: number;
  maxHealthRegen: number;
  maxEnergy: number;
  maxEnergyRegen: number;
  maxBasicAttack: number;
  maxAttackSpeed: number;
  maxArmor: number;
  maxShield: number;
}

export interface GameFood {
  id: number;
  rarity: number;
  experience: number;
  name: string;
  description: string;
  emoji: string;
}

export interface IdleItem {
  baseCost: number;
  baseProfit: number;
  upgrades: Map<number, IdleLevel>;
}

export interface IdleLevel {
  title: string;
  response: string;
  meme: string;
}

export interface Mission {
  amount: number;
  commandName: string;
  title: string;
  reward: number;
}

export interface Background {
  id: number;
  name: string;
  blob: Image;
  vipNeeded: boolean;
}

export interface Theme {
  id: string;
  rectangle: Image;
  username: string;
  discriminator: string;
  userdivider: string;
  xpbarText: string;
  xpbarRatioUp: string;
  xpbarRatioDown: string;
  badgeShadow: string;
  badgeFilling: string;
  xpbarFilling: string;
  clanRectFilling: string;
  clanName: string;
  clanText: string;
  clanURL: string;
}
