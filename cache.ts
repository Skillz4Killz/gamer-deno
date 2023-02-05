import { configs } from "./configs.ts";
import { Bot, Camelize, Collection, createBot, DiscordGuild, DiscordMessage } from "./deps.ts";
import { CommandSchema, GiveawaySchema, MirrorSchema, RolemessageSchema, ServerlogsSchema, WelcomeSchema } from "./src/database/schemas.ts";
import { MessageCollector, ReactionCollector } from "./src/types/collectors.ts";
import { PermissionLevels } from "./src/types/commands.ts";
import { Constants, Mission } from "./src/types/constants.ts";
import { CustomEvents } from "./src/types/events.ts";
import { Helpers } from "./src/types/helpers.ts";
import { Monitor } from "./src/types/monitors.ts";
import { Task } from "./src/types/tasks.ts";
import { Argument, Command } from "./src/utils/helpers.ts";

export const Gamer = createBot({
  token: configs.token,
  events: {}
}) as unknown as GamerBot;

Gamer.fullyReady = false;
Gamer.dispatchedGuildIDs = new Set();
Gamer.dispatchedChannelIDs = new Set();
Gamer.arguments = new Collection();
Gamer.commands = new Collection();
Gamer.eventHandlers = {} as CustomEvents;
Gamer.activeMembersOnSupportServer = new Set();
Gamer.webhooks = new Collection();
Gamer.failedWebhooks = new Set();
Gamer.spyRecords = new Collection();
Gamer.vipUserIDs = new Set(configs.userIDs.botOwners);
Gamer.xpEnabledGuildIDs = new Set([configs.supportServerID]);
Gamer.missionsDisabledGuildIDs = new Set();
Gamer.missions = [];
Gamer.missionStartedAt = Date.now();
Gamer.memberLastActive = new Collection();
Gamer.activeGuildIDs = new Set();
Gamer.activeGiveaways = new Collection();
Gamer.recentGiveawayReactors = new Collection();
Gamer.recentWelcomes = new Collection();
// Allow undefined to mark guilds that are inactive to prevent multiple db fetches
Gamer.recentLogs = new Collection();
Gamer.recentRoleMessages = new Collection();
Gamer.invites = new Collection();
/** The message id and amount transferred today */
Gamer.transferLog = new Map();
// Guild Related Settings
Gamer.guildPrefixes = new Collection();
Gamer.guildLanguages = new Collection();
Gamer.autoEmbedChannelIDs = new Set();
Gamer.mirrors = new Map();
Gamer.vipGuildIDs = new Set([configs.supportServerID]);
Gamer.guildSupportChannelIDs = new Set();
Gamer.guildMailLogsChannelIDs = new Map();
Gamer.guildMailRatingsChannelIDs = new Map();
Gamer.tenorDisabledGuildIDs = new Set();
Gamer.analyticsMessages = new Map();
Gamer.analyticsMemberJoin = new Map();
Gamer.analyticsMemberLeft = new Map();
Gamer.analyticsDetails = new Map();
Gamer.guildsXPPerMessage = new Map();
Gamer.guildsXPPerMinuteVoice = new Map();
Gamer.guildIDsAnalyticsEnabled = new Set();
Gamer.commandPermissions = new Collection();
Gamer.autoreactChannelIDs = new Set();
Gamer.countingChannelIDs = new Set();
Gamer.reactionRoleMessageIDs = new Set();
Gamer.giveawayMessageIDs = new Set();
Gamer.pollMessageIDs = new Set();
Gamer.feedbackChannelIDs = new Set();
Gamer.todoChannelIDs = new Set();
Gamer.eventMessageIDs = new Set();
/** guildID-name */
Gamer.tagNames = new Set();
// List of modules. Support the official AOV server by default!
Gamer.modules = new Map([["aov", "293208951473045504"]]);

Gamer.messageCollectors = new Collection<string, MessageCollector>();
Gamer.reactionCollectors = new Collection<string, ReactionCollector>();
Gamer.inhibitors = new Collection<
  string,
  (message: Camelize<DiscordMessage>, command: Command<any>, guild?: Camelize<DiscordGuild>) => Promise<boolean>
>();
Gamer.monitors = new Collection<string, Monitor>();
Gamer.permissionLevels = new Collection<
  PermissionLevels,
  (message: Camelize<DiscordMessage>, command: Command<any>, guild?: Camelize<DiscordGuild>) => Promise<boolean>
>();
Gamer.tasks = new Collection<string, Task>();
Gamer.helpers = {} as Helpers;
Gamer.constants = {} as Constants;
Gamer.stats = {
  messagesProcessed: 0,
  messagesDeleted: 0,
  messagesEdited: 0,
  messagesSent: 0,
  reactionsAddedProcessed: 0,
  reactionsRemovedProcessed: 0,
  commandsRan: 0,
  feedbacksSent: 0,
  automod: 0,
};
Gamer.slowmode = new Collection();
Gamer.blacklistedIDs = new Set();

export interface GamerBot extends Bot {
  fullyReady: false;
  dispatchedGuildIDs: Set<string>;
  dispatchedChannelIDs: Set<string>;
  arguments: Collection<string, Argument>;
  commands: Collection<string, Command<any>>;
  eventHandlers: CustomEvents;
  activeMembersOnSupportServer: Set<string>;
  webhooks: Collection<string, { id: string; webhookID: string; token: string }>;
  failedWebhooks: Set<string>;
  spyRecords: Collection<string, string[]>;
  vipUserIDs: Set<string>;
  xpEnabledGuildIDs: Set<string>;
  missionsDisabledGuildIDs: Set<string>;
  missions: Mission[];
  missionStartedAt: number;
  memberLastActive: Collection<string, number>;
  activeGuildIDs: Set<string>;
  activeGiveaways: Collection<string, GiveawaySchema>;
  recentGiveawayReactors: Collection<string, number>;
  recentWelcomes: Collection<string, WelcomeSchema>;
  // Allow undefined to mark guilds that are inactive to prevent multiple db fetches
  recentLogs: Collection<string, ServerlogsSchema | undefined>;
  recentRoleMessages: Collection<string, RolemessageSchema | undefined>;
  invites: Collection<string, CachedInvite>;
  /** The message id and amount transferred today */
  transferLog: Map<string, number>;
  // Guild Related Settings
  guildPrefixes: Collection<string, string>;
  guildLanguages: Collection<string, string>;
  autoEmbedChannelIDs: Set<string>;
  mirrors: Map<string, MirrorSchema[]>;
  vipGuildIDs: Set<string>;
  guildSupportChannelIDs: Set<string>;
  guildMailLogsChannelIDs: Map<string, string>;
  guildMailRatingsChannelIDs: Map<string, string>;
  tenorDisabledGuildIDs: Set<string>;
  analyticsMessages: Map<string, number>;
  analyticsMemberJoin: Map<string, number>;
  analyticsMemberLeft: Map<string, number>;
  analyticsDetails: Map<string, number>;
  guildsXPPerMessage: Map<string, number>;
  guildsXPPerMinuteVoice: Map<string, number>;
  guildIDsAnalyticsEnabled: Set<string>;
  commandPermissions: Collection<string, CommandSchema>;
  autoreactChannelIDs: Set<string>;
  countingChannelIDs: Set<string>;
  reactionRoleMessageIDs: Set<string>;
  giveawayMessageIDs: Set<string>;
  pollMessageIDs: Set<string>;
  feedbackChannelIDs: Set<string>;
  todoChannelIDs: Set<string>;
  eventMessageIDs: Set<string>;
  /** guildID-name */
  tagNames: Set<string>;
  // List of modules. Support the official AOV server by default!
  modules: Map<string, string>;

  messageCollectors: Collection<string, MessageCollector>;
  reactionCollectors: Collection<string, ReactionCollector>;
  inhibitors: Collection<string, (message: Camelize<DiscordMessage>, command: Command<any>, guild?: Camelize<DiscordGuild>) => Promise<boolean>>;
  monitors: Collection<string, Monitor>;
  permissionLevels: Collection<
    PermissionLevels,
    (message: Camelize<DiscordMessage>, command: Command<any>, guild?: Camelize<DiscordGuild>) => Promise<boolean>
  >;
  tasks: Collection<string, Task>;
  helpers: Helpers;
  constants: Constants;
  stats: {
    messagesProcessed: number;
    messagesDeleted: number;
    messagesEdited: number;
    messagesSent: number;
    reactionsAddedProcessed: number;
    reactionsRemovedProcessed: number;
    commandsRan: number;
    feedbacksSent: number;
    automod: number;
  };
  slowmode: Collection<string, number>;
  blacklistedIDs: Set<string>;
}

interface CachedInvite {
  code: string;
  guildID: string;
  channelID: string;
  memberID: string;
  uses: number;
}
