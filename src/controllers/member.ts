import {
  botCache,
  cache,
  controllers,
  DiscordPayload,
  GuildBanPayload,
  GuildMemberAddPayload,
  structures,
} from "../../deps.ts";

controllers.GUILD_MEMBER_ADD = async function handleInternalGuildMemberAdd(
  data: DiscordPayload,
) {
  if (data.t !== "GUILD_MEMBER_ADD") return;

  const payload = data.d as GuildMemberAddPayload;
  const guild = await cache.guilds.get(payload.guild_id);
  if (!guild) return;

  guild.memberCount++;
  await structures.createMember(
    payload,
    payload.guild_id,
  );

  botCache.eventHandlers.memberAdd?.(
    guild,
    payload.user,
    cache.members.get(payload.user.id),
  );
};

controllers.GUILD_MEMBER_REMOVE =
  async function handleInternalGuildMemberRemove(data: DiscordPayload) {
    if (data.t !== "GUILD_MEMBER_REMOVE") return;

    const payload = data.d as GuildBanPayload;
    const guild = cache.guilds.get(payload.guild_id);
    if (!guild) return;

    guild.memberCount--;
    const member = cache.members.get(payload.user.id);
    botCache.eventHandlers.memberRemove?.(
      guild,
      payload.user,
      member,
    );

    member?.guilds.delete(guild.id);
    if (member && !member.guilds.size) cache.members.delete(payload.user.id);
  };

declare module "../../deps.ts" {
  interface EventHandlers {
    tag: string;
    avatarURL: string;
    mfaEnabled?: undefined;
    premiumType?: undefined;
    username?: undefined;
    discriminator?: undefined;
    avatar?: undefined;
  }
}
