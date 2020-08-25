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

export interface Helpers {
  // Basic Utils
  chooseRandom: <T>(array: T[]) => T;

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
}
