import { db } from "../database.ts";

export interface ClientSchema {
  // Required for MongoDB.
  _id: string;

	botID: string;

	// Bot Statistics. Using string to prevent big ints from breaking.
	messagesProcessed: string;
	messagesDeleted: string;
	messagesEdited: string;
	messagesSent: string;
	reactionsAddedProcessed: string;
	reactionsRemovedProcessed: string;
	commandsRan: string;
}

export const clientsDatabase = db.collection<ClientSchema>("clients");
