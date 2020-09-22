import type { db } from "../database.ts";

export interface SurveySchema {
  /** This must always exist for MongoDB. */
  _id: string;

  /** The name of the survey */
  name: string;
  /** The questions for this survey */
  questions: {
    /** The question to ask the user */
    question: string;
    /** The type of response to request from the user. */
    type: string;
    /** The options that are allowed if it multiple choice */
    options: string[];
  }[];
  /** The guild where this survey was created */
  guildID: string;
  /** The person who created this survey. */
  creatorID: string;
  /** The channel id where the results will be sent for this survey. */
  channelID: string;
  /** The roles that are allowed to respond to this survey. */
  allowedRoleIDs: string[];
  /** Whether the user must answer questions in DM */
  useDM: boolean;
}

export const surveysDatabase = db.collection<SurveySchema>("surveys");
