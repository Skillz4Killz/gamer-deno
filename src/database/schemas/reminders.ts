import type { db } from "../database.ts";

export interface ReminderSchema {
  // Required for MongoDB.
  _id: string;

  /** The channel the reminder was created in and will be sent */
  channelID: string;
  /** The text the reminder will send. */
  content: string;
  /** The guild id where this was created. useful for getting the guild language */
  guildID: string;
  /** The unique id(message id) of the reminder. Useful for users deleting reminders. */
  reminderID: string;
  /** If the reminder is recurring the time interval between reminders */
  interval?: number;
  /** Whether or not this reminder is recurring */
  recurring: boolean;
  /** The timestampt when this reminder will occur next. */
  timestamp: number;
  /** The user id of the person who created this reminder. */
  memberID: string;
}

export const remindersDatabase = db.collection<ReminderSchema>("reminders");
