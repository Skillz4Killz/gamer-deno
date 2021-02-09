import { AlertsSchema } from "../../src/database/schemas.ts";
import { configs } from "./configs.ts";
import { Sabr, SabrTable } from "./deps.ts";

// Create the database class
const sabr = new Sabr();
sabr.directoryPath = configs.database.directoryPath;
// DEBUGGING CAN SHUT IT UP
sabr.error = async function () {
};

export const db = {
  twitch: new SabrTable<AlertsSchema>(sabr, "twitch"),
};

await sabr.init();
