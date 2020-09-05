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
  logsGuildID: string;
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

  // To Do Feature
  todoBacklogChannelID: string;
  todoCurrentSprintChannelID: string;
  todoNextSprintChannelID: string;
  todoArchivedChannelID: string;
  todoCompletedChannelID: string;

  // Mails feature
  mailsEnabled: boolean;
  mailsRoleIDs: string[];
  mailsGuildID: string;
  mailCategoryID: string;
  mailAutoResponse: string;
  mailQuestions: {
    text: string;
    name: string;
    type: "reaction" | "message";
    subtype?: string;
    options?: string[];
  }[];
}

export const guildsDatabase = db.collection<GuildSchema>("guilds");
