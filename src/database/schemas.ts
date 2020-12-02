export interface AlertsSchema {
  /** The username or unique name of what to follow. Reddit name, twitch username, twitter name etc.. */
  id: string;
  /** The subs */
  subscriptions: AlertSub[];
}

export interface AlertSub {
  /** The guild ID where this alert is */
  guildID: string;
  /** The exact channel id where this laert was made. Note: users can move webhooks so they may not be 100% accurate */
  channelID: string;
  /** The webhook token */
  webhookToken: string;
  /** The webhook id */
  webhookID: string;
  /** The filter text for example twitch game, or keyword */
  filter: string;
  /** The custom text which will be the `content` when sending a message to use to @ or whatever. */
  text: string;
}

export interface AggregatedAnalyticSchema extends AnalyticSchema {
  timestamp: number;
  guildID: string;
}

export interface AnalyticSchema {
  /** The guild id */
  id: string;
  /** The amount of messages sent on the server */
  messageCount: number;
  /** The amount of member join events */
  membersJoined: number;
  /** The amount of member leave events */
  membersLeft: number;
  /** This can be for channels, users, emojis all of the ids */
  [key: string]: number | string;
}

export interface AutoreactSchema {
  id: string;
  reactions: string[];
}

export interface BlacklistedSchema {
  /** The id of the user or guild that is blacklisted. */
  id: string;
  /** Whether this is for a user or a guild. */
  type: "user" | "guild";
}

export interface ClientSchema {
  botID: string;
  // Bot Statistics. Using string to prevent big ints from breaking.
  messagesProcessed: string;
  messagesDeleted: string;
  messagesEdited: string;
  messagesSent: string;
  reactionsAddedProcessed: string;
  reactionsRemovedProcessed: string;
  commandsRan: string;
  feedbacksSent: string;
}

export interface CountingSchema {
  /** The guild id where this counting game was created */
  guildID: string;
  /** The channel id where this counting game is in. */
  channelID: string;
  /** The loser role id to assign when the user breaks the count */
  loserRoleID: string;
  /** Whether this game is global or only localized to the server */
  localOnly: boolean;
  /** Whether to delete non-number messages */
  deleteInvalid: boolean;
  /** The current count */
  count: number;
  /** The buffs actived for this team */
  buffs: number[];
  /** The debuffs that are on this team */
  debuffs: number[];
}

export interface DefaultRoleSetsSchema {
  guildID: string;
  name: string;
  defaultRoleID: string;
  roleIDs: string[];
}

export interface EmojiSchema {
  /** The user id who created this emoji */
  userID: string;
  /** The id of the emoji */
  emojiID: string;
  /** The full unicode version of the emoji <:name:id> */
  fullCode: string;
  /** The guild id where the emoji is stored */
  guildID: string;
  /** The custom name for this emoji */
  name: string;
}

export interface EventsSchema {
  /** Message id that created the event maybe. Something unique */
  id: string;
  /** The actual event id */
  eventID: number;
  /** The time the event created */
  createdAt: number;
  /** The amount of minutes to wait before starting this event. */
  minutesFromNow: number;
  /** The positions this event will allow */
  positions: {
    name: string;
    amount: number;
  }[];
  /** The guild id where this event was made */
  guildID: string;
  /** The id of the user who made this event */
  userID: string;
  /** Does the event repeat */
  isRecurring: boolean;
  /** The timestamp ms when this event is set to start */
  startsAt: number;
  /** The timestamp ms when this event is set to end */
  endsAt: number;
  /** The amount of ms to wait before the event restarts if recurring. */
  frequency: number;
  /** The title of the event */
  title: string;
  /** The description of the event */
  description: string;
  /** The platform is a place users can write custom text */
  platform: string;
  /** The game is a place users can write custom text */
  game: string;
  /** The activity is a place users can write custom text */
  activity: string;
  /** VIP can set a custom background */
  backgroundURL: string;
  /** Whether or not to remove recurring attendees. */
  removeRecurringAttendees: boolean;
  /** Whether or not to send reminders to users in dm */
  dmReminders: boolean;
  /** Whether or not to send reminders in the channel */
  channelReminders: boolean;
  /** Whether ot not to show attendees on the card */
  showAttendees: boolean;
  /** Whether or not to show the utc time on the card */
  showUTCTime: boolean;
  /** The reminders to send. */
  reminders: number[];
  /** The reminders that have already been sent */
  executedReminders: number[];
  /** Whether or not this event has started */
  hasStarted: boolean;
  /** The milliseconds of how long this event will last */
  duration: number;
  /** The max amount of users that can accept to this event */
  maxAttendees: number;
  /** The ids of the users who are attending */
  acceptedUsers: EventAttendee[];
  /** The ids of the users who are not attending */
  deniedUserIDs: string[];
  /** The ids of the users currently waiting for a spot in attending */
  waitingUsers: EventAttendee[];
  /** The ids of users who are not allowed to enter this event anymore. */
  bannedUsersIDs: string[];
  /** The role ids that are allowed to enter this event. User must have atleast 1 */
  allowedRoleIDs: string[];
  /** The role ids that are going to be mentioned for this event when it is reminded. */
  alertRoleIDs: string[];
  /** The role ids that are going to be given to the user when they join this event. */
  joinRoleID: string;
  /** The ids ofthe users who want to attend but are not sure. */
  maybeUserIDs: string[];
  /** The channel id where the card is */
  cardChannelID: string;
  /** The message id where the card is */
  cardMessageID: string;
  /** The name of this template if this was changed to a template event */
  templateName: string;
}

export interface EventAttendee {
  /** The user id */
  id: string;
  /** The position the user has applied for */
  position: string;
}

export interface FeedbackSchema {
  id: string;
  userID: string;
  guildID: string;
  channelID: string;
  number: number;
  isBugReport: boolean;
}

export interface GachaSchema {
  ownedCharacters: GachaCharacter[];
  ownedItems: GachaItem[];
  ownedAbilities: GachaAbility[];
  gachas: number;
  foods: number[];
}

export interface GachaCharacter {
  id: number;
  experience: number;
  skin: number;
}

export interface GachaItem {
}

export interface GachaAbility {
}

export interface GuildSchema {
  // Basic settings
  guildID: string;
  prefix: string;
  language: string;
  isVIP: boolean;
  tenorEnabled: boolean;

  // Leveling Settings
  xpEnabled: boolean;
  missionsDisabled: boolean;
  xpDecayDays: number;
  decayPercentange: number;
  xpPerMessage: number;
  xpPerMinuteVoice: number;
  allowedBackgroundURLs: string[];
  hideMarriage: boolean;

  // Events Settings
  eventsAdvertiseChannelID: string;

  // Staff role ids
  adminRoleID: string;
  modRoleIDs: string[];

  // Server log channels
  logsGuildID: string;
  modlogsChannelID: string;
  publiclogsChannelID: string;
  botChannelID: string;
  channelsChannelID: string;
  emojisChannelID: string;
  membersChannelID: string;
  messagesChannelID: string;
  rolesChannelID: string;
  imagesChannelID: string;

  // Auto Embed Feature channel IDs
  autoembedChannelIDs: string[];

  // To Do Feature
  todoBacklogChannelID: string;
  todoCurrentSprintChannelID: string;
  todoNextSprintChannelID: string;
  todoArchivedChannelID: string;
  todoCompletedChannelID: string;

  // Mails feature
  mailsEnabled: boolean;
  mailsRoleIDs: string[];
  mailsGuildID: string;
  mailCategoryID: string;
  mailAutoResponse: string;
  mailQuestions: Question[];

  // Feedback Feature
  approvalChannelID: string;
  solvedChannelID: string;
  rejectedChannelID: string;
  solvedMessage: string;
  rejectedMessage: string;
  feedbackLogChannelID: string;
  ideaChannelID: string;
  ideaQuestions: Question[];
  bugsChannelID: string;
  bugsQuestions: Question[];

  // Moderation
  publicRoleIDs: string[];
  muteRoleID: string;
  capitalPercentage: number;
  profanityEnabled: boolean;
  profanityWords: string[];
  profanityStrictWords: string[];
  profanityPhrases: string[];
  linksEnabled: boolean;
  linksChannelIDs: string[];
  linksUserIDs: string[];
  linksRoleIDs: string[];
  linksURLs: string[];
  linksRestrictedURLs: string[];

  // Verification
  verifyCategoryID: string;

  // Tags feature
  disabledTagChannelIDs: string[];

  // ANalytics feature
  analyticsChannelID: string;

  // Events feature
  createEventsRoleID: string;
}

export interface IdleSchema {
  id: string;
  lastUpdatedAt: number;
  currency: string;
  guildIDs: string[];
  friends: number;
  servers: number;
  channels: number;
  roles: number;
  perms: number;
  messages: number;
  invites: number;
  bots: number;
  hypesquads: number;
  nitro: number;
}

export interface ItemSchema {
  /** Unique id of this item using the message id */
  id: string;
  /** The game related to this item. */
  game: "counting";
  /** The channel id relevant to this item */
  channelID: string;
  /** The member id who bought this item. */
  memberID: string;
  /** The item id */
  itemID: number;
  /** The type of the item */
  type: "buff" | "debuff";
  /** The guild id where this item was bought. */
  guildID: string;
  /** The timestamp of when this item expires */
  expiresAt: number;
  /** For items that effect a certain amount of counts, this shows when it started */
  currentCount?: number;
}

export interface LabelSchema {
  /** The user id for who created the label */
  userID: string;
  /** The category id that this label is assigned to. Mails with this label will be moved to this category */
  categoryID: string;
  /** The guild id where this label is created */
  guildID: string;
  /** The main guild id for this mail system */
  mainGuildID: string;
  /** The name of the label */
  name: string;
}

export interface LevelSchema {
  /** The id is the guildID-level# */
  id: string;
  /** The role ids to grant */
  roleIDs: string[];
}

export interface MailSchema {
  /* The channel id for this mail. Also used as the unique identifier */
  channelID: string;
  /* The user id who sent the mail. */
  userID: string;
  /* The guild id for where the mail was created */
  guildID: string;
  /* The mail guild id for this mail system */
  mainGuildID: string;
  /* The first 50 characters of the mail. */
  topic: string;
}

export interface MarriageSchema {
  /** The user id */
  id: string;
  /** The spouse user id */
  spouseID: string;
  /** Whether or not the spouse accepted this marriage */
  accepted: boolean;
  /** Wedding step */
  step: number;
  /** Life command step */
  lifeStep: number;
  /** The amount of love in this marriage */
  love: number;
}

export interface MirrorSchema {
  guildID: string;
  name: string;
  sourceChannelID: string;
  mirrorChannelID: string;
  sourceGuildID: string;
  mirrorGuildID: string;
  webhookToken: string;
  webhookID: string;
  deleteSourceMessages?: boolean;
  anonymous?: boolean;
  filterImages?: boolean;
}

export interface MissionSchema {
  /** UserID-commandName */
  id: string;
  userID: string;
  commandName: string;
  amount: number;
  completed: boolean;
}

export interface ModlogSchema {
  /** The action that was taken for this modlog */
  action: string;
  /** The amount of time a user is punished for. Used for temporary timed mutes. */
  duration?: number;
  /** The guild id where the modlog was created */
  guildID: string;
  /** The main guild ID for this modlog. */
  mainGuildID: string;
  /** The message id that created this modlog */
  messageID: string;
  /** The user id for the moderator who took this action */
  modID: string;
  /** The unique modlog id for the server */
  modlogID: number;
  /** If this log was a temporary mute, this tells us that this log still needs to unmute this user */
  needsUnmute: boolean;
  /** The reason that the mod gave for this action */
  reason: string;
  /** The timestamp that this modlog was created */
  timestamp: number;
  /** The user id  of the user who was the target of this action */
  userID: string;
}

export interface ModulesSchema {
  /** Both guildids combined to make the unique id */
  id: string;
  /** The guild id from where the tag was made public globally. */
  sourceGuildID: string;
  /** The guild id this tag is installed/downloaded in. */
  guildID: string;
}

export interface MuteSchema {
  /** The timestamp when to mute the user. */
  unmuteAt: number;
  /** The roles that were removed from this user when they were muted. */
  roleIDs: string[];
  /** The guild id where this mute is */
  guildID: string;
  /** The user id of the muted user. */
  userID: string;
  /** The userID-guildID for this mute */
  id: string;
}

export interface ReactionRoleSchema {
  /** The id of the reaction role */
  id: string;
  /** The guild id where it was created */
  guildID: string;
  name: string;
  messageID: string;
  channelID: string;
  authorID: string;
  reactions: {
    reaction: string;
    roleIDs: string[];
  }[];
}

export interface ReminderSchema {
  /** The channel the reminder was created in and will be sent */
  channelID: string;
  /** The text the reminder will send. */
  content: string;
  /** The guild id where this was created. useful for getting the guild language */
  guildID: string;
  /** The unique id(message id) of the reminder. Useful for users deleting reminders. */
  reminderID: string;
  /** If the reminder is recurring the time interval between reminders */
  interval?: number;
  /** Whether or not this reminder is recurring */
  recurring: boolean;
  /** The timestampt when this reminder will occur next. */
  timestamp: number;
  /** The user id of the person who created this reminder. */
  memberID: string;
}

export interface RolemessageSchema {
  /** The channel id where this message will be sent */
  channelID: string;
  /** The guild id were this role message was created */
  guildID: string;
  /** The id of the role */
  id: string;
  /** The text for the message to be sent when a role is added. Can be JSON embed stringified. */
  roleAddedText: string;
  /** The text for the message to be sent when a role is removed. Can be JSON embed stringified. */
  roleRemovedText: string;
  /** Whether this should be done if the role is added or removed. */
  roleAdded: boolean;
}

export interface GroupedRoleSetsSchema {
  guildID: string;
  name: string;
  mainRoleID: string;
  roleIDs: string[];
}

export interface RequiredRoleSetsSchema {
  guildID: string;
  name: string;
  requiredRoleID: string;
  roleIDs: string[];
}

export interface SpySchema {
  /** The user id */
  id: string;
  /** The words this user is following. */
  words: string[];
}

export interface SurveySchema {
  /** The name of the survey */
  name: string;
  /** The questions for this survey */
  questions: {
    /** The question to ask the user */
    question: string;
    /** The type of response to request from the user. */
    type: string;
    /** The options that are allowed if it multiple choice */
    options: string[];
  }[];
  /** The guild where this survey was created */
  guildID: string;
  /** The person who created this survey. */
  creatorID: string;
  /** The channel id where the results will be sent for this survey. */
  channelID: string;
  /** The roles that are allowed to respond to this survey. */
  allowedRoleIDs: string[];
  /** Whether the user must answer questions in DM */
  useDM: boolean;
}

export interface TagSchema {
  /** The unique guildID-name for this tag. */
  id: string;
  /** The strings provided by the user to choose from. */
  randomOptions: string[];
  /** The content that will be sent. Usually a JSON string to send embed */
  embedCode: string;
  /** The guild id where this tag was created */
  guildID: string;
  /** Whether this tag is allowed outside of mails */
  mailOnly: boolean;
  /** The name for the tag */
  name: string;
  /** The type of tag. Basic, advanced, random */
  type: string;
  /** Whether the tag is allowed to be used on other servers */
  isPublic: boolean;
  /** The amount of seconds this tag should delete itself after */
  seconds: number;
}

export interface UniqueRoleSetsSchema {
  guildID: string;
  name: string;
  roleIDs: string[];
}

export interface UserSchema {
  /** The user id who created this emoji */
  userID: string;
  /** The guild ids that this user is in. */
  guildIDs: string[];
  /** The id for the background for the user */
  backgroundID: number;
  /** The custom background URL if the user is a vip they can provide thier own. */
  backgroundURL: string;
  /** VIP ONLY! The urls for the badges for this user's profile */
  badges: string[];
  /** VIP users can override and forcibly show marriage */
  showMarriage: boolean;
  /** The theme of the background */
  theme: string;
  /** Whether the afk feature is enabled for this user. */
  afkEnabled: boolean;
  /** The message to be sent when afk is enabled */
  afkMessage: boolean;
  /** Checks if the user is VIP */
  isVIP: boolean;
  /** The guild ids of the servers this user has registered as VIP. */
  vipGuildIDs: string[];
  /** The user description that wll appear on the profile card */
  description: string;
  /** The current xp for this user. */
  xp: number;
  /** The amount of gamer coins this user has. */
  coins: number;
}

export interface XPSchema {
  /** guildID-userID */
  id: string;
  memberID: string;
  guildID: string;
  xp: number;
  voiceXP: number;
  lastUpdatedAt: number;
  joinedVoiceAt: number;
}

export interface Question {
  text: string;
  name: string;
  type: "reaction" | "message";
  subtype?: string;
  options?: string[];
}
