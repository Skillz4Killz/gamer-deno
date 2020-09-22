import { db } from "../database.ts";

export interface ModlogSchema {
  /** This must always exist for MongoDB. */
  _id: string;

  /** The action that was taken for this modlog */
  action: string;
  /** The amount of time a user is punished for. Used for temporary timed mutes. */
  duration?: number;
  /** The guild id where the modlog was created */
  guildID: string;
  /** The main guild ID for this modlog. */
  mainGuildID: string;
  /** The message id that created this modlog */
  messageID: string;
  /** The user id for the moderator who took this action */
  modID: string;
  /** The unique modlog id for the server */
  modlogID: number;
  /** If this log was a temporary mute, this tells us that this log still needs to unmute this user */
  needsUnmute: boolean;
  /** The reason that the mod gave for this action */
  reason: string;
  /** The timestamp that this modlog was created */
  timestamp: number;
  /** The user id  of the user who was the target of this action */
  userID: string;
}

export const modlogsDatabase = db.collection<ModlogSchema>("modlogs");
