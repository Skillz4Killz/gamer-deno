import type { db } from "../database.ts";

export interface AnalyticSchema {
  /** This must always exist for MongoDB. */
  _id: string;

  guildID: string;
  timestamp: number;
  channelID: string;
  userID: string;
  type: "MESSAGE_CREATE" | "MEMBER_ADDED" | "MEMBER_REMOVED";
}

export const analyticsDatabase = db.collection<AnalyticSchema>("analytics");
