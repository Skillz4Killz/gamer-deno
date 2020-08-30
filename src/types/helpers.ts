import {
  Message,
  MessageReactionUncachedPayload,
  ReactionPayload,
} from "../../deps.ts";
import {
  MessageCollectorOptions,
  CollectMessagesOptions,
  ReactionCollectorOptions,
  CollectReactionsOptions,
} from "./collectors.ts";
import { GuildSchema } from "../database/schemas/guilds.ts";

export interface Helpers {
  // Basic Utils
  chooseRandom: <T>(array: T[]) => T;
  snowflakeToTimestamp: (id: string) => number;
  toTitleCase: (text: string) => string;

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

  // Database stuff
  upsertGuild: (id: string) => Promise<GuildSchema | null>;

  // Others
  todoReactionHandler: (
    message: Message,
    emoji: ReactionPayload,
    userID: string,
  ) => unknown;
}
