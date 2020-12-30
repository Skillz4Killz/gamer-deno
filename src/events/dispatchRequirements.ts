import {
  botCache,
  botID,
  cache,
  getChannels,
  getGuild,
  getMember,
  structures,
  UpdateGuildPayload,
} from "../../deps.ts";
import { getTime } from "../utils/helpers.ts";

botCache.eventHandlers.dispatchRequirements = async function (data, shardID) {
  if (!botCache.fullyReady) return;
  // DELETE MEANS WE DONT NEED TO FETCH. CREATE SHOULD HAVE DATA TO CACHE
  if (data.t && ["GUILD_CREATE", "GUILD_DELETE"].includes(data.t)) return;

  const id =
    data.t && ["GUILD_CREATE", "GUILD_DELETE", "GUILD_UPDATE"].includes(data.t)
      ? // deno-lint-ignore no-explicit-any
        (data.d as any)?.id
      : // deno-lint-ignore no-explicit-any
        (data.d as any)?.guild_id;

  if (!id || botCache.activeGuildIDs.has(id)) return;

  // If this guild is in cache, it has not been swept and we can cancel
  if (cache.guilds.has(id)) {
    botCache.activeGuildIDs.add(id);
    return;
  }

  // New guild id has appeared, fetch all relevant data
  console.log(`[DISPATCH] New Guild ID has appeared: ${id}`);

  const rawGuild = await getGuild(id, true) as UpdateGuildPayload;
  console.log(`[DISPATCH] Guild ID ${id} has been found. ${rawGuild.name}`);

  const [channels, botMember] = await Promise.all([
    getChannels(id, false),
    getMember(id, botID, { force: true }),
  ]);

  if (!botMember || !channels) {
    return console.error(
      `[DISPATCH] Guild ID ${id} Name: ${rawGuild.name} failed. Unable to get botMember or channels`,
    );
  }

  const guildBotMember = botMember.guilds.get(id);

  const guild = await structures.createGuild(
    {
      ...rawGuild,
      joined_at: guildBotMember
        ? new Date(guildBotMember.joinedAt).toISOString()
        : new Date().toISOString(),
      large: false,
      unavailable: false,
      member_count: rawGuild.approximate_member_count,
      voice_states: [],
      members: [],
      channels: [],
      presences: [],
    },
    shardID,
  );

  // Add to cache
  cache.guilds.set(id, guild);
  botCache.dispatchedGuildIDs.delete(id);
  channels.forEach((channel) => {
    botCache.dispatchedChannelIDs.delete(channel.id);
    cache.channels.set(channel.id, channel);
  });

  console.log(
    `[DISPATCH] Guild ID ${id} Name: ${guild.name} completely loaded.`,
  );
};

// Events that have
/**
 * channelCreate
 * channelUpdate
 * channelDelete
 * channelPinsUpdate
 * guildBanAdd
 * guildBanRemove
 * guildEmojisUpdate
 * guildIntegrationsUpdate
 * guildMemberAdd
 * guildMemberRemove
 * guildMemberUpdate
 * guildMembersChunk
 * guildRoleCreate
 * guildRoleUpdate
 * guildRoleDelete
 * inviteCreate
 * inviteDelete
 * messageCreate
 * messageUpdate
 * messageDelete
 * messageDeleteBulk
 * messageReactionAdd
 * messageReactionRemove
 * messageReactionRemoveAll
 * messageReactionRemoveEmoji
 * presenceUpdate
 * typingStart
 * voiceStateUpdate
 * voiceServerUpdate
 * webhooksUpdate
 */

// Events that dont have guild_id
/**
 * guildCreate id
 * guildUpdate id
 * guildDelete id
 */

export function sweepInactiveGuildsCache() {
  for (const guild of cache.guilds.values()) {
    if (botCache.activeGuildIDs.has(guild.id)) continue;

    console.log(`[DISPATCH] Removing Guild ${guild.name} with ID: ${guild.id}`);
    // This is inactive guild. Not a single thing has happened for atleast 30 minutes.
    // Not a reaction, not a message, not any event!

    for (const channel of cache.channels.values()) {
      if (channel.guildID !== guild.id) continue;
      cache.channels.delete(channel.id);
      botCache.dispatchedChannelIDs.delete(channel.id);
    }

    cache.guilds.delete(guild.id);
    botCache.dispatchedGuildIDs.add(guild.id);
  }

  // Reset activity for next interval
  botCache.activeGuildIDs.clear();
}
