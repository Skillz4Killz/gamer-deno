import type { Guild, Message } from "./deps.ts";
import type { Monitor } from "./src/types/monitors.ts";
import type { Task } from "./src/types/tasks.ts";
import type { CustomEvents } from "./src/types/events.ts";
import type { Helpers } from "./src/types/helpers.ts";
import type { Constants } from "./src/types/constants.ts";
import type {
  Argument,
  Command,
  PermissionLevels,
} from "./src/types/commands.ts";
import type {
  MessageCollector,
  ReactionCollector,
} from "./src/types/collectors.ts";

import { importDirectory } from "./src/utils/helpers.ts";
import { loadLanguages } from "./src/utils/i18next.ts";
import { configs } from "./configs.ts";
import StartBot, { Collection, Intents } from "./deps.ts";
import { MirrorSchema } from "./src/database/schemas.ts";

console.info(
  "Beginning Bot Startup Process. This can take a little bit depending on your system. Loading now...",
);

await importDirectory(Deno.realPathSync("./src/structures"));

export const botCache = {
  arguments: new Collection<string, Argument>(),
  commands: new Collection<string, Command>(),
  eventHandlers: {} as CustomEvents,
  activeMembersOnSupportServer: new Set<string>(),

  // Guild Related Settings
  guildPrefixes: new Collection<string, string>(),
  guildLanguages: new Collection<string, string>(),
  autoEmbedChannelIDs: new Set<string>(),
  mirrors: new Map<string, MirrorSchema[]>(),
  vipGuildIDs: new Set<string>(),
  guildSupportChannelIDs: new Map<string, string>(),
  tenorDisabledGuildIDs: new Set<string>(),

  messageCollectors: new Collection<string, MessageCollector>(),
  reactionCollectors: new Collection<string, ReactionCollector>(),
  inhibitors: new Collection<
    string,
    (message: Message, command: Command, guild?: Guild) => Promise<boolean>
  >(),
  monitors: new Collection<string, Monitor>(),
  permissionLevels: new Collection<
    PermissionLevels,
    (message: Message, command: Command, guild?: Guild) => Promise<boolean>
  >(),
  tasks: new Collection<string, Task>(),
  helpers: {} as Helpers,
  constants: {} as Constants,
  stats: {
    messagesProcessed: 0,
    messagesDeleted: 0,
    messagesEdited: 0,
    messagesSent: 0,
    reactionsAddedProcessed: 0,
    reactionsRemovedProcessed: 0,
    commandsRan: 0,
    feedbacksSent: 0,
  },
  slowmode: new Collection<string, number>(),
};

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

StartBot({
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
