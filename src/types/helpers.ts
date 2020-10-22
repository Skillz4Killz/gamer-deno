import type {
  Channel,
  Collection,
  Guild,
  Member,
  Message,
  MessageReactionUncachedPayload,
  ReactionPayload,
} from "../../deps.ts";
import type {
  CollectMessagesOptions,
  CollectReactionsOptions,
  MessageCollectorOptions,
  ReactionCollectorOptions,
} from "./collectors.ts";
import type { Embed } from "../utils/Embed.ts";
import { GuildSchema } from "../database/schemas.ts";

export interface Helpers {
  // Basic Utils
  chooseRandom: <T>(array: T[]) => T;
  snowflakeToTimestamp: (id: string) => number;
  toTitleCase: (text: string) => string;

  // Moderation utils
  createModlog: (
    message: Message,
    options: {
      action: `ban` | `unban` | `mute` | `unmute` | `warn` | `kick` | `note`;
      member?: Member;
      userID?: string;
      reason: string;
      duration?: number;
    },
  ) => Promise<number>;
  modlogEmbed: (
    message: Message,
    modlogID: number,
    options: {
      action: `ban` | `unban` | `mute` | `unmute` | `warn` | `kick` | `note`;
      member?: Member;
      userID?: string;
      reason: string;
      duration?: number;
    },
  ) => Embed;

  // Collectors
  needMessage: (
    memberID: string,
    channelID: string,
    options?: MessageCollectorOptions | undefined,
  ) => Promise<Message>;
  collectMessages: (options: CollectMessagesOptions) => Promise<Message[]>;
  needReaction: (
    memberID: string,
    messageID: string,
    options?: ReactionCollectorOptions,
  ) => Promise<string>;
  collectReactions: (options: CollectReactionsOptions) => Promise<string[]>;
  processReactionCollectors: (
    message: Message | MessageReactionUncachedPayload,
    emoji: ReactionPayload,
    userID: string,
  ) => void;

  // Discord Helpers
  isModOrAdmin: (message: Message, settings: GuildSchema) => boolean;
  isAdmin: (message: Message, settings?: GuildSchema | null) => boolean;
  reactError: (message: Message, vip?: boolean) => void;
  reactSuccess: (message: Message) => void;
  emojiID: (emoji: string) => string | undefined;
  emojiUnicode: (emoji: ReactionPayload) => string;
  moveMessageToOtherChannel: (
    message: Message,
    channelID: string,
  ) => Promise<Message | undefined>;
  fetchMember: (guildID: string, userID: string) => Promise<Member | undefined>;
  fetchMembers: (
    guildID: string,
    userIDs: string[],
  ) => Promise<Collection<string, Member> | undefined>;

  // Database stuff
  upsertGuild: (id: string) => Promise<GuildSchema>;

  // Mod Mail Stuff
  mailHandleDM: (message: Message, content: string) => unknown;
  mailHandleSupportChannel: (message: Message, content: string) => unknown;
  mailCreate: (message: Message, content: string, member?: Member) => unknown;

  // Transform Utils

  variables: (
    text: string,
    member?: Member,
    guild?: Guild,
    author?: Member,
  ) => Promise<string>;

  // Others
  todoReactionHandler: (
    message: Message,
    emoji: ReactionPayload,
    userID: string,
  ) => unknown;
  sendFeedback: (
    message: Message,
    channel: Channel,
    embed: Embed,
    settings: GuildSchema,
    isBugReport?: boolean,
  ) => unknown;
  handleFeedbackReaction: (
    message: Message,
    emoji: ReactionPayload,
    userID: string,
  ) => unknown;
  removeFeedbackReaction: (
    message: Message,
    emoji: ReactionPayload,
    userID: string,
  ) => unknown;
}
