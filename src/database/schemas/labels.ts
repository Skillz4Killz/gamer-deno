import type { db } from "../database.ts";

export interface LabelSchema {
  /** This must always exist for MongoDB. */
  _id: string;

  /** The user id for who created the label */
  userID: string;
  /** The category id that this label is assigned to. Mails with this label will be moved to this category */
  categoryID: string;
  /** The guild id where this label is created */
  guildID: string;
  /** The main guild id for this mail system */
  mainGuildID: string;
  /** The name of the label */
  name: string;
}

export const labelsDatabase = db.collection<LabelSchema>("labels");
