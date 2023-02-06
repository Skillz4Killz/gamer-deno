import {
  cache,
  Collection,
  createNewProp,
  channelOverwriteHasPermission,
  editChannel,
  sendMessage,
  deleteChannel,
  deleteChannelOverwrite,
  kickFromVoiceChannel,
  Guild,
  Member,
  Message,
  editChannelOverwrite,
  ChannelCreatePayload,
  ChannelEditOptions,
  ChannelType,
  MessageContent,
  Overwrite,
  Permission,
  RawOverwrite,
} from "../../deps.ts";

const baseChannel: Partial<Channel> = {
  get guild() {
    return cache.guilds.get(this.guildID!);
  },
  get messages() {
    return cache.messages.filter((m) => m.channelID === this.id!);
  },
  get mention() {
    return `<#${this.id!}>`;
  },
  send(content) {
    return sendMessage(this.id!, content);
  },
  disconnect(memberID) {
    return kickFromVoiceChannel(this.guildID!, memberID);
  },
  delete() {
    return deleteChannel(this.guildID!, this.id!);
  },
  editOverwrite(id, options) {
    return editChannelOverwrite(this.guildID!, this.id!, id, options);
  },
  deleteOverwrite(id) {
    return deleteChannelOverwrite(this.guildID!, this.id!, id);
  },
  hasPermission(overwrites, permissions) {
    return channelOverwriteHasPermission(this.guildID!, this.id!, overwrites, permissions);
  },
  edit(options, reason) {
    return editChannel(this.id!, options, reason);
  },
};

// deno-lint-ignore require-await
export async function createChannel(data: ChannelCreatePayload, guildID?: string) {
  const {
    guild_id: rawGuildID = "",
    last_message_id: lastMessageID,
    user_limit: userLimit,
    rate_limit_per_user: rateLimitPerUser,
    parent_id: parentID = undefined,
    last_pin_timestamp: lastPinTimestamp,
    permission_overwrites: permissionOverwrites = [],
    nsfw = false,
    ...rest
  } = data;

  const restProps: Record<string, ReturnType<typeof createNewProp>> = {};
  for (const key of Object.keys(rest)) {
    // We dont need channel topics
    if (key === "topic") continue;
    // @ts-ignore index signature
    restProps[key] = createNewProp(rest[key]);
  }

  const channel = Object.create(baseChannel, {
    ...restProps,
    guildID: createNewProp(guildID || rawGuildID),
    lastMessageID: createNewProp(lastMessageID),
    userLimit: createNewProp(userLimit),
    rateLimitPerUser: createNewProp(rateLimitPerUser),
    parentID: createNewProp(parentID),
    lastPinTimestamp: createNewProp(lastPinTimestamp ? Date.parse(lastPinTimestamp) : undefined),
    permissionOverwrites: createNewProp(permissionOverwrites),
    nsfw: createNewProp(nsfw),
  });

  return channel as Channel;
}

export interface Channel {
  /** The id of this channel */
  id: string;
  /** Sorting position of the channel */
  position?: number;
  /** The name of the channel (2-100 characters) */
  name?: string;
  /** The bitrate (in bits) of the voice channel */
  bitrate?: number;
  /** The type of the channel */
  type: ChannelType;
  /** The guild id of the channel if it is a guild channel. */
  guildID: string;
  /** The id of the last message sent in this channel */
  lastMessageID?: string;
  /** The amount of users allowed in this voice channel. */
  userLimit?: number;
  /** The rate limit(slowmode) in this text channel that users can send messages. */
  rateLimitPerUser?: number;
  /** The category id for this channel */
  parentID?: string;
  /** The last time when a message was pinned in this channel */
  lastPinTimestamp?: number;
  /** The permission overwrites for this channel */
  permissionOverwrites: RawOverwrite[];
  /** Whether this channel is nsfw or not */
  nsfw: boolean;

  // GETTERS

  /**
   * Gets the guild object for this channel.
   *
   * ⚠️ ADVANCED: If you use the custom cache, these will not work for you. Getters can not be async and custom cache requires async.
   */
  guild?: Guild;
  /**
   * Gets the messages from cache that were sent in this channel
   *
   * ⚠️ ADVANCED: If you use the custom cache, these will not work for you. Getters can not be async and custom cache requires async.
   */
  messages: Collection<string, Message>;
  /** The mention of the channel */
  mention: string;
  /**
   * Gets the connected members for this channel undefined if member is not cached
   *
   * ⚠️ ADVANCED: If you use the custom cache, these will not work for you. Getters can not be async and custom cache requires async.
   */
  connectedMembers?: Collection<string, Member | undefined>;

  // METHODS

  /** Send a message to the channel. Requires SEND_MESSAGES permission. */
  send(content: string | MessageContent): ReturnType<typeof sendMessage>;
  /** Disconnect a member from a voice channel. Requires MOVE_MEMBERS permission. */
  disconnect(memberID: string): ReturnType<typeof kickFromVoiceChannel>;
  /** Delete the channel */
  delete(): ReturnType<typeof deleteChannel>;
  /** Edit a channel Overwrite */
  editOverwrite(overwriteID: string, options: Omit<Overwrite, "id">): ReturnType<typeof editChannelOverwrite>;
  /** Delete a channel Overwrite */
  deleteOverwrite(overwriteID: string): ReturnType<typeof deleteChannelOverwrite>;
  /** Checks if a channel overwrite for a user id or a role id has permission in this channel */
  hasPermission(
    overwrites: RawOverwrite[],
    permissions: Permission[]
  ): ReturnType<typeof channelOverwriteHasPermission>;
  /** Edit the channel */
  edit(options: ChannelEditOptions, reason?: string): ReturnType<typeof editChannel>;
}
