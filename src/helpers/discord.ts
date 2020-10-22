import { botCache } from "../../mod.ts";
import { sendResponse } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";
import {
  addReaction,
  botHasChannelPermissions,
  cache,
  Collection,
  deleteMessage,
  fetchMembers,
  Member,
  memberIDHasPermission,
  Permissions,
  sendMessage,
} from "../../deps.ts";

botCache.helpers.isModOrAdmin = (message, settings) => {
  const guild = cache.guilds.get(message.guildID);
  if (!guild) return false;

  const member = guild.members.get(message.author.id);
  if (!member) return false;

  if (botCache.helpers.isAdmin(message, settings)) return true;
  return settings.modRoleIDs.some((id) => member.roles.includes(id));
};

botCache.helpers.isAdmin = (message, settings) => {
  const guild = cache.guilds.get(message.guildID);
  if (!guild) return false;

  const member = guild.members.get(message.author.id);
  const hasAdminPerm = memberIDHasPermission(
    message.author.id,
    message.guildID,
    ["ADMINISTRATOR"],
  );
  if (hasAdminPerm) return true;

  return member && settings?.adminRoleID
    ? member.roles.includes(settings.adminRoleID)
    : false;
};

botCache.helpers.snowflakeToTimestamp = function (id) {
  return Math.floor(Number(id) / 4194304) + 1420070400000;
};

botCache.helpers.reactError = function (message, vip = false) {
  if (vip) sendResponse(message, translate(message.guildID, "common:NEED_VIP"));
  addReaction(message.channelID, message.id, "❌");
};

botCache.helpers.reactSuccess = function (message) {
  addReaction(message.channelID, message.id, botCache.constants.emojis.success);
};

botCache.helpers.emojiID = function (emoji) {
  if (!emoji.startsWith("<")) return;
  return emoji.substring(emoji.lastIndexOf(":") + 1, emoji.length - 1);
};

botCache.helpers.emojiUnicode = function (emoji) {
  return emoji.animated || emoji.id
    ? `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`
    : emoji.name || "";
};

botCache.helpers.moveMessageToOtherChannel = async function (
  message,
  channelID,
) {
  const channel = cache.channels.get(channelID);
  if (!channel) return;

  if (
    !botHasChannelPermissions(
      channelID,
      [
        Permissions.VIEW_CHANNEL,
        Permissions.SEND_MESSAGES,
        Permissions.EMBED_LINKS,
      ],
    )
  ) {
    return;
  }

  const newMessage = await sendMessage(
    channel.id,
    { content: message.content, embed: message.embeds[0] },
  );
  if (!newMessage) return;

  deleteMessage(message);
  return newMessage;
};

botCache.helpers.fetchMember = async function (guildID, id) {
  // Dumb ts shit on array destructuring https://github.com/microsoft/TypeScript/issues/13778
  if (!id) return;

  const userID = id.startsWith("<@")
    ? id.substring(id.startsWith("<@!") ? 3 : 2, id.length - 1)
    : id;

  const guild = cache.guilds.get(guildID);
  if (!guild) return;

  const cachedMember = guild.members.get(userID);
  if (cachedMember) return cachedMember;

  // Fetch from gateway as it is much better than wasting limited HTTP calls.
  const member = await fetchMembers(guild, { userIDs: [userID] }).catch(() =>
    undefined
  );
  return member?.first();
};

botCache.helpers.fetchMembers = async function (guildID, ids) {
  const userIDs = ids.map((id) =>
    id.startsWith("<@")
      ? id.substring(id.startsWith("<@!") ? 3 : 2, id.length - 1)
      : id
  );

  const guild = cache.guilds.get(guildID);
  if (!guild) return;

  const members = new Collection<string, Member>();

  for (const userID of userIDs) {
    const cachedMember = guild.members.get(userID);
    if (cachedMember) members.set(userID, cachedMember);
  }

  const uncachedIDs = userIDs.filter((id) => !members.has(id));
  if (members.size === ids.length || !uncachedIDs.length) return members;

  // Fetch from gateway as it is much better than wasting limited HTTP calls.
  const remainingMembers = await fetchMembers(guild, { userIDs: uncachedIDs })
    .catch(() => undefined);

  if (!remainingMembers) return members;

  for (const member of remainingMembers.values()) {
    members.set(member.id, member);
  }

  return members;
};
