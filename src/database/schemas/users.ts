import { db } from "../database.ts";

export interface UserSchema {
  /** This must always exist for MongoDB. */
  _id: string;

  /** The user id who created this emoji */
  userID: string;
  /** The guild ids that this user is in. */
  guildIDs: string[];
  /** The id for the background for the user */
  backgroundID: number;
  /** The theme of the background */
  theme: string;
  /** Whether the afk feature is enabled for this user. */
  afkEnabled: boolean;
  /** The message to be sent when afk is enabled */
  afkMessage: boolean;
  /** Checks if the user is VIP */
  isVIP: boolean;
  /** The guild ids of the servers this user has registered as VIP. */
  vipGuildIDs: string[];
  /** The boosts this user has */
  boosts: {
    /** Whether this boost is activated. */
    active: boolean;
    /** When this boost was activated */
    activatedAt: number;
    /** The name of this boost. */
    name: string;
    /** The amount of multiplier this boost grants. */
    multiplier: number;
    /** The amount of time this boost will last for. */
    duration: number;
  }[];
  /** The current xp for this user. */
  xp: number;
  /** The amount of gamer coins this user has. */
  coins: number;
}

export const usersDatabase = db.collection<UserSchema>("users");
