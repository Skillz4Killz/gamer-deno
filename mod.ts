import Client, {
  Collection,
  Message,
  Guild,
  Intents,
  logger,
} from "./deps.ts";
import { configs } from "./configs.ts";
import { Command, Argument, PermissionLevels } from "./src/types/commands.ts";
import { importDirectory } from "./src/utils/helpers.ts";
import { Monitor } from "./src/types/monitors.ts";
import { Task } from "./src/types/tasks.ts";
import { loadLanguages } from "./src/utils/i18next.ts";
import { CustomEvents } from "./src/types/events.ts";
import { MessageCollector, ReactionCollector } from "./src/types/collectors.ts";
import { Helpers } from "./src/types/helpers.ts";
import { Constants } from "./src/types/constants.ts";
import { MirrorSchema } from "./src/database/schemas/mirrors.ts";

logger.info(
  "Beginning Bot Startup Process. This can take a little bit depending on your system. Loading now...",
);

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
  },
  slowmode: new Collection<string, number>()
};

// Load these first before anything else so they are available for the rest.
await importDirectory(Deno.realPathSync("./src/constants"))
await importDirectory(Deno.realPathSync("./src/helpers"))
await importDirectory(Deno.realPathSync("./src/events"))

// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
  [
    "./src/commands",
    "./src/inhibitors",
    "./src/arguments",
    "./src/monitors",
    "./src/tasks",
    "./src/permissionLevels",
    "./src/events",
  ].map(
    (path) => importDirectory(Deno.realPathSync(path)),
  ),
);

logger.info(
  "Loading Languages...",
);
// Loads languages
await loadLanguages();
logger.info(
  "Loading Database",
);
await import("./src/database/database.ts");

Client({
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

