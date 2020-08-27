import { db } from "../database.ts";

export interface AnalyticSchema {
	/** This must always exist for MongoDB. */
	_id: string;

	guildID: string;
}

export const analyticsDatabase = db.collection<AnalyticSchema>("analytics");
