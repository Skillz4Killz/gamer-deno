import { structures, MessageCreateOptions, cache } from "../../deps.ts";

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

  // In case guildID was not present since Discord doesn't always send, we can check the guild by channel
  if (!message.guildID) {
    const channel = cache.channels.get(message.channelID);
    if (channel?.guildID) message.guildID = channel.guildID;
  }

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
