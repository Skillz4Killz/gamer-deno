import type { db } from "../database.ts";

export interface RequiredRoleSetsSchema {
  // Required for MongoDB.
  _id: string;

  guildID: string;
  name: string;
  requiredRoleID: string;
  roleIDs: string[];
}

export const requiredRoleSetsDatabase = db.collection<RequiredRoleSetsSchema>(
  "requiredrolesets",
);
