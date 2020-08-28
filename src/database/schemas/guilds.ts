import { db } from "../database.ts";

export interface GuildSchema {
  // Required for MongoDB.
  _id: string;

  // Basic settings
  guildID: string;
  prefix: string;
  language: string;
  isVIP: boolean;

  // Staf role ids
  adminRoleID: string;
  modRoleIDs: string[];

  // Server log channels
  modlogsChannelID: string;
  publiclogsChannelID: string;
  botChannelID: string;
  channelsChannelID: string;
  emojisChannelID: string;
  membersChannelID: string;
  messagesChannelID: string;
  rolesChannelID: string;

  // Auto Embed Feature channel IDs
  autoembedChannelIDs: string[];
}

export const guildsDatabase = db.collection<GuildSchema>("guilds");
