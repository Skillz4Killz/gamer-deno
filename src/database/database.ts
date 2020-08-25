import { Database } from "https://deno.land/x/denodb@v1.0.7/mod.ts";
import GuildSchema from "./schemas/guilds.ts";

export const MongoDB = new Database("mongo", {
  uri: "mongodb://127.0.0.1:27017",
  database: "test",
})
  // Links schemas to tables
  .link([
    GuildSchema,
  ])
  // Creates the tables if not already present
  .sync();
