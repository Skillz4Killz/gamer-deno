import { Sabr, SabrTable } from "./deps.ts";
import { AlertsSchema } from "../../src/database/schemas.ts";

// Create the database class
const sabr = new Sabr();
console.log("path", Deno.realPathSync("db"));

console.log(sabr);

console.log("in db file", sabr.directoryPath);

export const db = {
  // This will allow us to access table methods easily as we will see below.
  sabr,
  twitter: new SabrTable<AlertsSchema>(sabr, "twitter"),
};

// This is important as it prepares all the tables.
await sabr.init();
