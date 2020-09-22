import type { db } from "../database.ts";

export interface MailSchema {
  /** This must always exist for MongoDB. */
  _id: string;

  /* The channel id for this mail. Also used as the unique identifier */
  channelID: string;
  /* The user id who sent the mail. */
  userID: string;
  /* The guild id for where the mail was created */
  guildID: string;
  /* The mail guild id for this mail system */
  mainGuildID: string;
  /* The first 50 characters of the mail. */
  topic: string;
}

export const mailsDatabase = db.collection<MailSchema>("mails");
