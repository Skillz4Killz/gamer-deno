import { importDirectory } from "./src/utils/helpers.ts";
import { loadLanguages } from "./src/utils/i18next.ts";
import { configs } from "./configs.ts";
import { Intents, startBot } from "./deps.ts";
import { botCache } from "./cache.ts";

console.info(
  "Beginning Bot Startup Process. This can take a little bit depending on your system. Loading now...",
);

await importDirectory(Deno.realPathSync("./src/structures"));

// Load these first before anything else so they are available for the rest.
await importDirectory(Deno.realPathSync("./src/constants"));
await importDirectory(Deno.realPathSync("./src/helpers"));
await importDirectory(Deno.realPathSync("./src/events"));

// The order of these is not important.
await Promise.all(
  [
    "./src/commands",
    "./src/inhibitors",
    "./src/arguments",
    "./src/monitors",
    "./src/tasks",
    "./src/permissionLevels",
  ].map(
    (path) => importDirectory(Deno.realPathSync(path)),
  ),
);

console.info("Loading Languages...");
// Loads languages
await loadLanguages();
console.info("Loading Database");

await import("./src/database/database.ts");

startBot({
  token: configs.token,
  // Pick the intents you wish to have for your bot.
  intents: [
    Intents.GUILDS,
    Intents.GUILD_MESSAGES,
    Intents.DIRECT_MESSAGES,
    Intents.GUILD_MEMBERS,
    Intents.GUILD_BANS,
    Intents.GUILD_EMOJIS,
    Intents.GUILD_VOICE_STATES,
    Intents.GUILD_INVITES,
    Intents.GUILD_MESSAGE_REACTIONS,
    Intents.DIRECT_MESSAGE_REACTIONS,
  ],
  // These are all your event handler functions. Imported from the events folder
  eventHandlers: botCache.eventHandlers,
});
