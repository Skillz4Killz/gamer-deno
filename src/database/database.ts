import { MongoClient } from "https://deno.land/x/mongo@v0.11.0/mod.ts";
import { configs } from "../../configs.ts";

const client = new MongoClient();
client.connectWithUri(configs.database.connectionURL);

export const db = client.database(configs.database.name);
