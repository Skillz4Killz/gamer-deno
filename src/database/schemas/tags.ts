import { db } from "../database.ts";

export interface TagSchema {
  /** This must always exist for MongoDB. */
  _id: string;

  /** The content that will be sent. Usually a JSON string to send embed */
  embedCode: string;
  /** The guild id where this tag was created */
  guildID: string;
  /** Whether this tag is allowed outside of mails */
  mailOnly: boolean;
  /** The name for the tag */
  name: string;
  /** The type of tag. Basic, advanced, random */
  type: string;
  /** Whether the tag is allowed to be used on other servers */
  isPublic: boolean;
  /** The amount of seconds this tag should delete itself after */
  seconds: number;
}

export const tagsDatabase = db.collection<TagSchema>("tags");
