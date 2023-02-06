import type {
  Channel,
  Collection,
  Guild,
  Member,
  Message,
  MessageReactionUncachedPayload,
  ReactionPayload,
} from "../../deps.ts";
import { GuildSchema, PollsSchema } from "../database/schemas.ts";
import type { Embed } from "../utils/Embed.ts";
import type {
  CollectMessagesOptions,
  CollectReactionsOptions,
  MessageCollectorOptions,
  ReactionCollectorOptions,
} from "./collectors.ts";

export interface Helpers {
  // Basic Utils
  chooseRandom: <T>(array: T[]) => T;
  snowflakeToTimestamp: (id: string) => number;
  toTitleCase: (text: string) => string;
  chunkStrings: (array: string[], chunkSize?: number, separateLines?: boolean) => string[];
  authorEmbed: (message: Message) => Embed;
  shortNumber: (number: bigint | number | string) => string;
  booleanEmoji: (bool: boolean) => string;

  // Polls
  processPollResults: (poll: PollsSchema) => unknown;

  // Leveling Utils
  addLocalXP: (guildID: string, memberID: string, xpAmountToAdd?: number, overrideCooldown?: boolean) => Promise<void>;
  addGlobalXP: (memberID: string, xpAmountToAdd?: number, overrideCooldown?: boolean) => Promise<void>;
  removeXP: (guildID: string, memberID: string, xpAmountToAdd?: number) => Promise<void>;
  completeMission: (guildID: string, memberID: string, commandName: string) => Promise<void>;
  makeProfileCanvas: (guildID: string, memberID: string, options?: ProfileCanvasOptions) => Promise<Blob | undefined>;
  makeLocalCanvas: (message: Message, member: Member) => Promise<Blob | undefined>;
  makeGlobalCanvas: (message: Message, member: Member) => Promise<Blob | undefined>;
  makeVoiceCanvas: (message: Message, member: Member) => Promise<Blob | undefined>;
  makeCoinsCanvas: (message: Message, member: Member) => Promise<Blob | undefined>;

  // Moderation utils
  createModlog: (
    message: Message,
    options: {
      action: `ban` | `unban` | `mute` | `unmute` | `warn` | `kick` | `note`;
      member?: Member;
      userID?: string;
      reason: string;
      duration?: number;
    }
  ) => Promise<unknown>;
  modlogEmbed: (
    message: Message,
    modlogID: number,
    options: {
      action: `ban` | `unban` | `mute` | `unmute` | `warn` | `kick` | `note`;
      member?: Member;
      userID?: string;
      reason: string;
      duration?: number;
    }
  ) => Promise<Embed>;

  // Collectors
  needMessage: (memberID: string, channelID: string, options?: MessageCollectorOptions | undefined) => Promise<Message>;
  collectMessages: (options: CollectMessagesOptions) => Promise<Message[]>;
  needReaction: (memberID: string, messageID: string, options?: ReactionCollectorOptions) => Promise<string>;
  collectReactions: (options: CollectReactionsOptions) => Promise<string[]>;
  processReactionCollectors: (
    message: Message | MessageReactionUncachedPayload,
    emoji: ReactionPayload,
    userID: string
  ) => void;

  // Discord Helpers
  isModOrAdmin: (message: Message, settings?: GuildSchema) => Promise<boolean>;
  isAdmin: (message: Message, settings?: GuildSchema | null) => Promise<boolean>;
  reactError: (message: Message, vip?: boolean, text?: string) => Promise<void>;
  reactSuccess: (message: Message) => Promise<void>;
  emojiReaction: (emoji: string) => string;
  emojiID: (emoji: string) => string | undefined;
  emojiUnicode: (emoji: ReactionPayload) => string;
  moveMessageToOtherChannel: (message: Message, channelID: string) => Promise<Message | undefined>;
  fetchMember: (guildID: string, userID: string) => Promise<Member | undefined>;
  fetchMembers: (guildID: string, userIDs: string[]) => Promise<Collection<string, Member> | undefined>;
  memberTag: (message: Message) => string;

  // Database stuff
  upsertGuild: (id: string) => Promise<GuildSchema>;

  // Mod Mail Stuff
  mailHandleDM: (message: Message, content: string) => unknown;
  mailHandleSupportChannel: (message: Message, content: string) => unknown;
  mailCreate: (message: Message, content: string, member?: Member) => unknown;

  // Transform Utils

  variables: (text: string, member?: Member, guild?: Guild, author?: Member) => Promise<string>;

  // Others
  todoReactionHandler: (message: Message, emoji: ReactionPayload, userID: string) => Promise<unknown>;
  sendFeedback: (
    message: Message,
    channel: Channel,
    embed: Embed,
    settings: GuildSchema,
    isBugReport?: boolean
  ) => Promise<unknown>;
  handleFeedbackReaction: (message: Message, emoji: ReactionPayload, userID: string) => Promise<unknown>;
  removeFeedbackReaction: (message: Message, emoji: ReactionPayload, userID: string) => Promise<unknown>;
}

export interface ProfileCanvasOptions {
  style?: string;
  backgroundID?: number;
}
