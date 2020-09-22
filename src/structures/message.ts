import type { MessageCreateOptions } from "../../deps.ts";

import { structures } from "../../deps.ts";

function createMessage(data: MessageCreateOptions) {
  const {
    guild_id: guildID,
    channel_id: channelID,
    mentions_everyone: mentionsEveryone,
    mention_channels: mentionChannels,
    mention_roles: mentionRoles,
    webhook_id: webhookID,
    message_reference: messageReference,
    edited_timestamp: editedTimestamp,
    ...rest
  } = data;

  const message = {
    ...rest,
    mentions: data.mentions.map((m) => m.id),
    channelID,
    guildID: guildID || "",
    mentionsEveryone,
    mentionRoles,
    mentionChannels: mentionChannels || [],
    webhookID,
    messageReference,
    timestamp: Date.parse(data.timestamp),
    editedTimestamp: editedTimestamp ? Date.parse(editedTimestamp) : undefined,
  };

  return message;
}

// deno-lint-ignore ban-ts-comment
// @ts-ignore
structures.createMessage = createMessage;

declare module "../../deps.ts" {
  interface Message {
    mentions: string[];
  }
}
