import { botCache } from "../../cache.ts";
import {
  botHasChannelPermissions,
  botHasPermission,
  botID,
  cache,
  ChannelTypes,
  hasChannelPermissions,
  memberHasPermission,
  Permissions,
} from "../../deps.ts";

botCache.eventHandlers.messageCreate = async function (message) {
  // Update stats in cache
  botCache.stats.messagesProcessed += 1;
  if (message.author.id === botID) botCache.stats.messagesSent += 1;
  if (!cache.isReady) return;

  const channel = cache.channels.get(message.channelID);
  if (!channel) return;

  botCache.monitors.forEach(async (monitor) => {
    // The !== false is important because when not provided we default to true
    if (monitor.ignoreBots !== false && message.author.bot) return;
    if (
      monitor.ignoreDM !== false && channel.type === ChannelTypes.DM
    ) {
      return;
    }

    if (monitor.ignoreEdits && message.editedTimestamp) return;
    if (monitor.ignoreOthers && message.author.id !== botID) return;

    // Permission checks

    // No permissions are required
    if (
      !monitor.botChannelPermissions?.length &&
      !monitor.botServerPermissions?.length &&
      !monitor.userChannelPermissions?.length &&
      !monitor.userServerPermissions?.length
    ) {
      return monitor.execute(message);
    }

    const guild = cache.guilds.get(message.guildID);
    // If some permissions is required it must be in a guild
    if (!guild) return;

    // Check if the message author has the necessary channel permissions to run this monitor
    if (
      monitor.userChannelPermissions &&
      monitor.userChannelPermissions.some(async (perm) =>
        !(await hasChannelPermissions(
          message.channelID,
          message.author.id,
          [perm],
        ))
      )
    ) {
      return;
    }

    const member = cache.members.get(message.author.id);
    // Check if the message author has the necessary permissions to run this monitor
    if (
      member?.guilds.has(message.guildID) &&
      monitor.userServerPermissions &&
      !memberHasPermission(
        message.author.id,
        guild,
        member?.guilds.get(message.guildID)?.roles || [],
        monitor.userServerPermissions,
      )
    ) {
      return;
    }

    // Check if the bot has the necessary channel permissions to run this monitor in this channel.
    if (
      monitor.botChannelPermissions &&
      monitor.botChannelPermissions.some((perm) =>
        !botHasChannelPermissions(
          message.channelID,
          [perm],
        )
      )
    ) {
      return;
    }

    // Check if the bot has the necessary permissions to run this monitor
    if (
      monitor.botServerPermissions &&
      monitor.botServerPermissions.some((perm) =>
        !botHasPermission(
          guild.id,
          [perm],
        )
      )
    ) {
      return;
    }

    return monitor.execute(message);
  });
};
