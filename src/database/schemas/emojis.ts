import { db } from "../database.ts";

export interface EmojiSchema {
  /** This must always exist for MongoDB. */
  _id: string;

  /** The user id who created this emoji */
  userID: string;
  /** The id of the emoji */
  emojiID: string;
  /** The full unicode version of the emoji <:name:id> */
  fullCode: string;
  /** The guild id where the emoji is stored */
  guildID: string;
  /** The custom name for this emoji */
  name: string;
}

export const emojisDatabase = db.collection<EmojiSchema>("emojis");
