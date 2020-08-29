import { db } from "../database.ts";

export interface UniqueRoleSetsSchema {
  // Required for MongoDB.
  _id: string;

  guildID: string;
  name: string;
  roleIDs: string[];
}

export const uniqueRoleSetsDatabase = db.collection<UniqueRoleSetsSchema>(
  "uniquerolesets",
);
