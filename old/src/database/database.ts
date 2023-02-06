import { configs } from "../../configs.ts";
import { botCache, Sabr, SabrTable } from "../../deps.ts";
import {
  AggregatedAnalyticSchema,
  AlertsSchema,
  AnalyticSchema,
  AutoreactSchema,
  BlacklistedSchema,
  ClientSchema,
  CommandSchema,
  CountingSchema,
  DefaultRoleSetsSchema,
  EmojiSchema,
  EnterpriseSchema,
  EventsSchema,
  FeedbackSchema,
  GachaSchema,
  GiveawaySchema,
  GroupedRoleSetsSchema,
  GuildSchema,
  ItemSchema,
  LabelSchema,
  LevelSchema,
  MailSchema,
  MarriageSchema,
  MirrorSchema,
  MissionSchema,
  ModlogSchema,
  ModulesSchema,
  MuteSchema,
  PollsSchema,
  ReactionRoleSchema,
  ReminderSchema,
  RequiredRoleSetsSchema,
  RolemessageSchema,
  ServerlogsSchema,
  ShortcutSchema,
  SpySchema,
  SurveySchema,
  TagSchema,
  UniqueRoleSetsSchema,
  UserSchema,
  VIPGuildSchema,
  VIPUserSchema,
  WelcomeSchema,
  XPSchema,
} from "./schemas.ts";

// Create the database class
const sabr = new Sabr();
sabr.directoryPath = configs.database.directoryPath;
// DEBUGGING CAN SHUT IT UP
sabr.error = async function () {};

export const db = {
  // This will allow us to access table methods easily as we will see below.
  sabr,
  aggregatedanalytics: new SabrTable<AggregatedAnalyticSchema>(sabr, "aggregatedanalytics"),
  analytics: new SabrTable<AnalyticSchema>(sabr, "analytics"),
  autoreact: new SabrTable<AutoreactSchema>(sabr, "autoreact"),
  blacklisted: new SabrTable<BlacklistedSchema>(sabr, "blacklisted"),
  client: new SabrTable<ClientSchema>(sabr, "client"),
  commands: new SabrTable<CommandSchema>(sabr, "commands"),
  counting: new SabrTable<CountingSchema>(sabr, "counting"),
  defaultrolesets: new SabrTable<DefaultRoleSetsSchema>(sabr, "defaultrolesets"),
  emojis: new SabrTable<EmojiSchema>(sabr, "emojis"),
  enterprise: new SabrTable<EnterpriseSchema>(sabr, "enterprise"),
  events: new SabrTable<EventsSchema>(sabr, "events"),
  feedbacks: new SabrTable<FeedbackSchema>(sabr, "feedbacks"),
  gachas: new SabrTable<GachaSchema>(sabr, "gachas"),
  giveaways: new SabrTable<GiveawaySchema>(sabr, "giveaways"),
  groupedrolesets: new SabrTable<GroupedRoleSetsSchema>(sabr, "groupedrolesets"),
  guilds: new SabrTable<GuildSchema>(sabr, "guilds"),
  vipGuilds: new SabrTable<VIPGuildSchema>(sabr, "vipGuilds"),
  items: new SabrTable<ItemSchema>(sabr, "items"),
  labels: new SabrTable<LabelSchema>(sabr, "labels"),
  levels: new SabrTable<LevelSchema>(sabr, "levels"),
  mails: new SabrTable<MailSchema>(sabr, "mails"),
  marriages: new SabrTable<MarriageSchema>(sabr, "marriages"),
  mirrors: new SabrTable<MirrorSchema>(sabr, "mirrors"),
  mission: new SabrTable<MissionSchema>(sabr, "mission"),
  modlogs: new SabrTable<ModlogSchema>(sabr, "modlogs"),
  modules: new SabrTable<ModulesSchema>(sabr, "modules"),
  mutes: new SabrTable<MuteSchema>(sabr, "mutes"),
  polls: new SabrTable<PollsSchema>(sabr, "polls"),
  reactionroles: new SabrTable<ReactionRoleSchema>(sabr, "reactionroles"),
  reminders: new SabrTable<ReminderSchema>(sabr, "reminders"),
  requiredrolesets: new SabrTable<RequiredRoleSetsSchema>(sabr, "requiredrolesets"),
  rolemessages: new SabrTable<RolemessageSchema>(sabr, "rolemessages"),
  serverlogs: new SabrTable<ServerlogsSchema>(sabr, "serverlogs"),
  shortcuts: new SabrTable<ShortcutSchema>(sabr, "shortcuts"),
  spy: new SabrTable<SpySchema>(sabr, "spy"),
  surveys: new SabrTable<SurveySchema>(sabr, "surveys"),
  tags: new SabrTable<TagSchema>(sabr, "tags"),
  uniquerolesets: new SabrTable<UniqueRoleSetsSchema>(sabr, "uniquerolesets"),
  users: new SabrTable<UserSchema>(sabr, "users"),
  vipUsers: new SabrTable<VIPUserSchema>(sabr, "vipUsers"),
  xp: new SabrTable<XPSchema>(sabr, "xp"),
  welcome: new SabrTable<WelcomeSchema>(sabr, "welcome"),

  // Alerts tables
  reddit: new SabrTable<AlertsSchema>(sabr, "reddit"),
  manga: new SabrTable<AlertsSchema>(sabr, "manga"),
  twitch: new SabrTable<AlertsSchema>(sabr, "twitch"),
  youtube: new SabrTable<AlertsSchema>(sabr, "youtube"),
  twitter: new SabrTable<AlertsSchema>(sabr, "twitter"),
  instagram: new SabrTable<AlertsSchema>(sabr, "instagram"),
  facebook: new SabrTable<AlertsSchema>(sabr, "facebook"),
};

// This is important as it prepares all the tables.
await sabr.init();

console.log(`Fetching all settings that need to be cached`);

const [
  guildSettings,
  mirrors,
  blacklisted,
  spyRecords,
  commandPerms,
  autoreacts,
  countings,
  reactionRoles,
  giveaways,
  polls,
] = await Promise.all([
  db.guilds.getAll(true),
  db.mirrors.getAll(true),
  db.blacklisted.getAll(true),
  db.spy.getAll(true),
  db.commands.getAll(true),
  db.autoreact.getAll(true),
  db.counting.getAll(true),
  db.reactionroles.getAll(true),
  db.giveaways.getAll(true),
  db.polls.getAll(true),
]);
const [tags, events, vipUsers] = await Promise.all([
  db.tags.getAll(true),
  db.events.getAll(true),
  db.vipUsers.getAll(true),
]);

console.info(`Loading Cached Settings:`);

for (const settings of guildSettings) {
  if (settings.prefix !== configs.prefix) {
    botCache.guildPrefixes.set(settings.id, settings.prefix);
  }

  botCache.guildLanguages.set(settings.id, settings.language);

  if (settings.autoembedChannelIDs) {
    settings.autoembedChannelIDs.forEach(async (id) => botCache.autoEmbedChannelIDs.add(id));
  }
  if (!settings.tenorEnabled) {
    botCache.tenorDisabledGuildIDs.add(settings.id);
  }
  if (settings.mailsSupportChannelID) {
    botCache.guildSupportChannelIDs.add(settings.mailsSupportChannelID);
  }
  if (settings.xpEnabled) {
    botCache.xpEnabledGuildIDs.add(settings.id);
  }
  if (settings.missionsDisabled) {
    botCache.missionsDisabledGuildIDs.add(settings.id);
  }
  if (settings.xpPerMessage) {
    botCache.guildsXPPerMessage.set(settings.id, settings.xpPerMessage);
  }
  if (settings.xpPerMinuteVoice) {
    botCache.guildsXPPerMinuteVoice.set(settings.id, settings.xpPerMinuteVoice);
  }
  if (settings.mailsLogChannelID) {
    botCache.guildMailLogsChannelIDs.set(settings.id, settings.mailsLogChannelID);
  }
  if (settings.mailsRatingsChannelID) {
    botCache.guildMailRatingsChannelIDs.set(settings.id, settings.mailsRatingsChannelID);
  }
  if (settings.approvalChannelID) {
    botCache.feedbackChannelIDs.add(settings.approvalChannelID);
  }
  if (settings.ideaChannelID) {
    botCache.feedbackChannelIDs.add(settings.ideaChannelID);
  }
  if (settings.bugsChannelID) {
    botCache.feedbackChannelIDs.add(settings.bugsChannelID);
  }
  if (settings.analyticsChannelID) {
    botCache.guildIDsAnalyticsEnabled.add(settings.id);
  }

  if (settings.todoArchivedChannelID) {
    botCache.todoChannelIDs.add(settings.todoArchivedChannelID);
  }

  if (settings.todoBacklogChannelID) {
    botCache.todoChannelIDs.add(settings.todoBacklogChannelID);
  }

  if (settings.todoCompletedChannelID) {
    botCache.todoChannelIDs.add(settings.todoCompletedChannelID);
  }

  if (settings.todoCurrentSprintChannelID) {
    botCache.todoChannelIDs.add(settings.todoCurrentSprintChannelID);
  }

  if (settings.todoNextSprintChannelID) {
    botCache.todoChannelIDs.add(settings.todoNextSprintChannelID);
  }
}

for (const mirror of mirrors) {
  const cached = botCache.mirrors.get(mirror.sourceChannelID);
  if (cached) {
    botCache.mirrors.set(mirror.sourceChannelID, [...cached, mirror]);
  } else {
    botCache.mirrors.set(mirror.sourceChannelID, [mirror]);
  }
}

// Add blacklisted users and guilds to cache so bot will ignore them.
for (const blacklist of blacklisted) {
  botCache.blacklistedIDs.add(blacklist.id);
}

// Add VIP users and guilds to cache
for (const user of vipUsers) {
  if (!user.isVIP) continue;
  botCache.vipUserIDs.add(user.id);
  user.guildIDs.forEach(botCache.vipGuildIDs.add, botCache.vipGuildIDs);
}

// Add all spy records to cache to prepare them
for (const record of spyRecords) {
  for (const word of record.words) {
    const current = botCache.spyRecords.get(word);
    // If the word doesnt exist we add a new one for this user id
    if (!current) botCache.spyRecords.set(word, [record.id]);
    // If it exist and this user id is not already set, add them
    else if (!current.includes(record.id)) {
      botCache.spyRecords.set(word, [...current, record.id]);
    }
  }
}

// Add all custom command perms to cache
for (const perms of commandPerms) {
  botCache.commandPermissions.set(perms.id, perms);
}

for (const autoreact of autoreacts) {
  botCache.autoreactChannelIDs.add(autoreact.id);
}

for (const counting of countings) {
  botCache.countingChannelIDs.add(counting.id);
}

for (const rr of reactionRoles) {
  botCache.reactionRoleMessageIDs.add(rr.messageID);
}

for (const giveaway of giveaways) {
  botCache.giveawayMessageIDs.add(giveaway.id);
}

for (const poll of polls) {
  botCache.pollMessageIDs.add(poll.id);
}

for (const tag of tags) {
  botCache.tagNames.add(`${tag.guildID}-${tag.name}`);
}

for (const event of events) {
  botCache.eventMessageIDs.add(event.cardMessageID);
}
