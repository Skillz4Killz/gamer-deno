import { configs } from "./configs.ts";
import { Collection, Guild, Message } from "./deps.ts";
import {
  CommandSchema,
  GiveawaySchema,
  MirrorSchema,
  RolemessageSchema,
  ServerlogsSchema,
  WelcomeSchema,
} from "./src/database/schemas.ts";
import { MessageCollector, ReactionCollector } from "./src/types/collectors.ts";
import { PermissionLevels } from "./src/types/commands.ts";
import { Constants, Mission } from "./src/types/constants.ts";
import { CustomEvents } from "./src/types/events.ts";
import { Helpers } from "./src/types/helpers.ts";
import { Monitor } from "./src/types/monitors.ts";
import { Task } from "./src/types/tasks.ts";
import { Argument, Command } from "./src/utils/helpers.ts";

export const botCache = {
  fullyReady: false,
  dispatchedGuildIDs: new Set<string>(),
  dispatchedChannelIDs: new Set<string>(),
  arguments: new Collection<string, Argument>(),
  commands: new Collection<string, Command<any>>(),
  eventHandlers: {} as CustomEvents,
  activeMembersOnSupportServer: new Set<string>(),
  webhooks: new Collection<string, { id: string; webhookID: string; token: string }>(),
  failedWebhooks: new Set<string>(),
  spyRecords: new Collection<string, string[]>(),
  vipUserIDs: new Set(configs.userIDs.botOwners),
  xpEnabledGuildIDs: new Set([configs.supportServerID]),
  missionsDisabledGuildIDs: new Set<string>(),
  missions: [] as Mission[],
  missionStartedAt: Date.now(),
  memberLastActive: new Collection<string, number>(),
  activeGuildIDs: new Set<string>(),
  activeGiveaways: new Collection<string, GiveawaySchema>(),
  recentGiveawayReactors: new Collection<string, number>(),
  recentWelcomes: new Collection<string, WelcomeSchema>(),
  // Allow undefined to mark guilds that are inactive to prevent multiple db fetches
  recentLogs: new Collection<string, ServerlogsSchema | undefined>(),
  recentRoleMessages: new Collection<string, RolemessageSchema | undefined>(),
  invites: new Collection<string, CachedInvite>(),

  /** The message id and amount transferred today */
  transferLog: new Map<string, number>(),

  // Guild Related Settings
  guildPrefixes: new Collection<string, string>(),
  guildLanguages: new Collection<string, string>(),
  autoEmbedChannelIDs: new Set<string>(),
  mirrors: new Map<string, MirrorSchema[]>(),
  vipGuildIDs: new Set([configs.supportServerID]),
  guildSupportChannelIDs: new Set<string>(),
  guildMailLogsChannelIDs: new Map<string, string>(),
  guildMailRatingsChannelIDs: new Map<string, string>(),
  tenorDisabledGuildIDs: new Set<string>(),
  analyticsMessages: new Map<string, number>(),
  analyticsMemberJoin: new Map<string, number>(),
  analyticsMemberLeft: new Map<string, number>(),
  analyticsDetails: new Map<string, number>(),
  guildsXPPerMessage: new Map<string, number>(),
  guildsXPPerMinuteVoice: new Map<string, number>(),
  guildIDsAnalyticsEnabled: new Set<string>(),
  commandPermissions: new Collection<string, CommandSchema>(),
  autoreactChannelIDs: new Set<string>(),
  countingChannelIDs: new Set<string>(),
  reactionRoleMessageIDs: new Set<string>(),
  giveawayMessageIDs: new Set<string>(),
  pollMessageIDs: new Set<string>(),
  feedbackChannelIDs: new Set<string>(),
  todoChannelIDs: new Set<string>(),
  eventMessageIDs: new Set<string>(),

  /** guildID-name */
  tagNames: new Set<string>(),
  // List of modules. Support the official AOV server by default!
  modules: new Map([["aov", "293208951473045504"]]),

  messageCollectors: new Collection<string, MessageCollector>(),
  reactionCollectors: new Collection<string, ReactionCollector>(),
  inhibitors: new Collection<string, (message: Message, command: Command<any>, guild?: Guild) => Promise<boolean>>(),
  monitors: new Collection<string, Monitor>(),
  permissionLevels: new Collection<
    PermissionLevels,
    (message: Message, command: Command<any>, guild?: Guild) => Promise<boolean>
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
    automod: 0,
  },
  slowmode: new Collection<string, number>(),
  blacklistedIDs: new Set<string>(),
};

interface CachedInvite {
  code: string;
  guildID: string;
  channelID: string;
  memberID: string;
  uses: number;
}
