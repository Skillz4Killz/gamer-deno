import { services } from "../../services.ts";
import { AlertsSchema } from "../../src/database/schemas.ts";
import { Sabr, SabrTable } from "./deps.ts";

// Create the database class
const sabr = new Sabr();
sabr.directoryPath = services.twitter.directoryPath;

export const db = {
  // This will allow us to access table methods easily as we will see below.
  sabr,
  twitter: new SabrTable<AlertsSchema>(sabr, "twitter"),
};

// This is important as it prepares all the tables.
await sabr.init();
