import {
  cache,
  Collection,
  GuildMember,
  MemberCreatePayload,
} from "../../deps.ts";

import { rawAvatarURL, structures } from "../../deps.ts";

function createMember(data: MemberCreatePayload, guildID: string) {
  const {
    joined_at: joinedAt,
    premium_since: premiumSince,
    user: userData,
    ...rest
  } = data;

  const {
    mfa_enabled: mfaEnabled,
    premium_type: premiumType,
    ...user
  } = data.user || {};

  const cached = cache.members.get(user.id);

  if (cached) {
    // Check if any of the others need updating
    if (user.username && user.discriminator) {
      cached.tag = `${user.username}#${user.discriminator}`;
    }
    if (user.bot) cached.bot = user.bot;

    // Set the guild data
    cached.guilds.set(guildID, {
      /** The user's guild nickname if one is set. */
      nick: data.nick,
      /** Array of role ids that the member has */
      roles: data.roles,
      /** When the user joined the guild. */
      joinedAt: Date.parse(joinedAt),
      /** When the user used their nitro boost on the server. */
      premiumSince: premiumSince ? Date.parse(premiumSince) : undefined,
      /** Whether the user is deafened in voice channels */
      deaf: data.deaf,
      /** Whether the user is muted in voice channels */
      mute: data.mute,
    });

    return cached;
  }

  const member = {
    id: user.id,
    avatarURL: rawAvatarURL(
      data.user?.id,
      data.user?.discriminator,
      data.user?.avatar,
    ),
    tag: `${data.user?.username}#${data.user?.discriminator}`,
    bot: data.user?.bot || false,
    /** The guild related data mapped by guild id */
    guilds: new Collection<string, GuildMember>(),
  };

  member.guilds.set(guildID, {
    nick: data.nick,
    roles: data.roles,
    joinedAt: Date.parse(joinedAt),
    premiumSince: premiumSince ? Date.parse(premiumSince) : undefined,
    deaf: data.deaf,
    mute: data.mute,
  });

  cache.members.set(member.id, member);

  return member;
}

// deno-lint-ignore ban-ts-comment
// @ts-ignore
structures.createMember = createMember;

declare module "../../deps.ts" {
  interface Member {
    tag: string;
    avatarURL: string;
    mfaEnabled?: undefined;
    premiumType?: undefined;
    username?: undefined;
    discriminator?: undefined;
    avatar?: undefined;
  }
}
