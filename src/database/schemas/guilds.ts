import { db } from "../database.ts";

export interface GuildSchema {
  _id: string;
  guildID: string;
  prefix: string;
  language: string;
}

export const guildsDatabase = db.collection<GuildSchema>("guilds");
