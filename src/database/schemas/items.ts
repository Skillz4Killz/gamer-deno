import { db } from "../database.ts";

export interface ItemSchema {
  /** This must always exist for MongoDB. */
  _id: string;

  /** The game related to this item. */
  game: "counting";
  /** The channel id relevant to this item */
  channelID: string;
  /** The member id who bought this item. */
  memberID: string;
  /** The item id */
  itemID: number;
  /** The type of the item */
  type: "buff" | "debuff";
  /** The guild id where this item was bought. */
  guildID: string;
  /** The timestamp of when this item expires */
  expiresAt: number;
  /** For items that effect a certain amount of counts, this shows when it started */
  currentCount?: number;
}

export const itemsDatabase = db.collection<ItemSchema>("items");
