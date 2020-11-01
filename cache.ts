import { Collection, Guild, Message } from "./deps.ts";
import { MirrorSchema } from "./src/database/schemas.ts";
import { MessageCollector, ReactionCollector } from "./src/types/collectors.ts";
import { Argument, Command, PermissionLevels } from "./src/types/commands.ts";
import { Constants } from "./src/types/constants.ts";
import { CustomEvents } from "./src/types/events.ts";
import { Helpers } from "./src/types/helpers.ts";
import { Monitor } from "./src/types/monitors.ts";
import { Task } from "./src/types/tasks.ts";

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
  blacklistedIDs: new Set<string>()
};
