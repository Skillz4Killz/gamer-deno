import { db } from "../database.ts";

export interface DefaultRoleSetsSchema {
  // Required for MongoDB.
  _id: string;

  guildID: string;
  name: string;
  defaultRoleID: string;
  roleIDs: string[];
}

export const defaultRoleSetsDatabase = db.collection<DefaultRoleSetsSchema>(
  "defaultrolesets",
);
