export interface AnalyticSchema {
  guildID: string;
  timestamp: number;
  channelID: string;
  userID: string;
  type: "MESSAGE_CREATE" | "MEMBER_ADDED" | "MEMBER_REMOVED";
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

export interface FeedbackSchema {
  id: string;
  userID: string;
  guildID: string;
  channelID: string;
  number: number;
  isBugReport: boolean;
}

export interface GuildSchema {
  // Basic settings
  guildID: string;
  prefix: string;
  language: string;
  isVIP: boolean;
  tenorEnabled: boolean;

  // Staf role ids
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
}

export interface ItemSchema {
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
  /** The boosts this user has */
  boosts: {
    /** Whether this boost is activated. */
    active: boolean;
    /** When this boost was activated */
    activatedAt: number;
    /** The name of this boost. */
    name: string;
    /** The amount of multiplier this boost grants. */
    multiplier: number;
    /** The amount of time this boost will last for. */
    duration: number;
  }[];
  /** The current xp for this user. */
  xp: number;
  /** The amount of gamer coins this user has. */
  coins: number;
}

export interface Question {
  text: string;
  name: string;
  type: "reaction" | "message";
  subtype?: string;
  options?: string[];
}
