import { db } from "../database.ts";

export interface CountingSchema {
  /** This must always exist for MongoDB. */
  _id: string;

  /** The guild id where this counting game was created */
  guildID: string;
  /** The channel id where this counting game is in. */
  channelID: string;
  /** The loser role id to assign when the user breaks the count */
  loserRoleID: string;
  /** Whether this game is global or only localized to the server */
  localOnly: boolean;
  /** Whether to delete non-number messages */
  deleteInvalid: boolean;
  /** The current count */
  count: number;
  /** The buffs actived for this team */
  buffs: number[];
  /** The debuffs that are on this team */
  debuffs: number[];
}

export const countingDatabase = db.collection<CountingSchema>("counting");
