import { Collection, Image } from "../../deps.ts";

export interface Constants {
  brand: {
    KICK_COLOR: string;
    KICK_IMAGE: string;
    BAN_COLOR: string;
    BAN_IMAGE: string;
    UNBAN_COLOR: string;
    UNBAN_IMAGE: string;
    WARN_COLOR: string;
    WARN_IMAGE: string;
    MUTE_COLOR: string;
    MUTE_IMAGE: string;
    UNMUTE_COLOR: string;
    UNMUTE_IMAGE: string;
  };
  themes: Collection<string, Theme>;
  backgrounds: Background[];
  missions: Mission[];
  levels: Collection<number, { name: string; xpNeeded: number; id: number }>;
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
    letters: string[];
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
    giveaway: string;
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
    dancemonkey: string;
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
