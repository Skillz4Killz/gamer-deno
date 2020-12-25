import {
  cache,
  Collection,
  GuildMember,
  MemberCreatePayload,
  rawAvatarURL,
  structures,
} from "../../deps.ts";

const baseMember: any = {
  get tag() {
    return `${this.username}#${this.discriminator}`;
  },
  get avatarURL() {
    return rawAvatarURL(this.id!, this.discriminator, this.avatar);
  },
};

function createNewProp(value: any) {
  return { configurable: true, enumerable: true, writable: true, value };
}

function createMember(data: MemberCreatePayload, guildID: string) {
  const {
    mfa_enabled: mfaEnabled,
    premium_type: premiumType,
    ...user
  } = data.user || {};

  const cached = cache.members.get(user.id);

  if (cached) {
    // Check if any of the others need updating
    cached.username = user.username;
    cached.discriminator = user.discriminator;

    // Set the guild data
    cached.guilds.set(guildID, {
      /** The user's guild nickname if one is set. */
      nick: data.nick,
      /** Array of role ids that the member has */
      roles: data.roles,
      /** When the user joined the guild. */
      joinedAt: Date.parse(data.joined_at),
      /** When the user used their nitro boost on the server. */
      premiumSince: data.premium_since
        ? Date.parse(data.premium_since)
        : undefined,
      /** Whether the user is deafened in voice channels */
      deaf: data.deaf,
      /** Whether the user is muted in voice channels */
      mute: data.mute,
    });

    return cached;
  }

  const member = Object.create(baseMember, {
    id: createNewProp(user.id),
    username: createNewProp(user.username),
    discriminator: createNewProp(user.discriminator),
    avatar: createNewProp(user.avatar),
    bot: createNewProp(user.bot || false),
    /** The guild related data mapped by guild id */
    guilds: createNewProp(new Collection<string, GuildMember>()),
  });

  member.guilds.set(guildID, {
    nick: data.nick,
    roles: data.roles,
    joinedAt: Date.parse(data.joined_at),
    premiumSince: data.premium_since
      ? Date.parse(data.premium_since)
      : undefined,
    deaf: data.deaf,
    mute: data.mute,
  });

  cache.members.set(member.id, member);

  return member;
}

// @ts-ignore
structures.createMember = createMember;

declare module "../../deps.ts" {
  interface Member {
    tag: string;
    avatarURL: string;
    mfaEnabled?: undefined;
    premiumType?: undefined;
    avatar?: undefined;
  }
}
