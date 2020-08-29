import { db } from "../database.ts";

export interface MirrorSchema {
  // Required for MongoDB.
  _id: string;

  guildID: string;
  name: string;
  sourceChannelID: string;
  mirrorChannelID: string;
  sourceGuildID: string;
  mirrorGuildID: string;
  webhookToken: string;
  webhookID: string;
  deleteSourceMessages?: boolean;
	anonymous?: boolean;
	filterImages?: boolean;
	
}

export const mirrorsDatabase = db.collection<MirrorSchema>("mirrors");
