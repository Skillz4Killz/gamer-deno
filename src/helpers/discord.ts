import { botCache } from "../../mod.ts";
import {
  addReaction,
  memberIDHasPermission,
  cache,
  sendMessage,
  botHasChannelPermissions,
  Permissions,
  deleteMessage,
} from "../../deps.ts";
import { sendResponse } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.helpers.isModOrAdmin = (message, settings) => {
  const member = message.member();
  if (!member) return false;

  if (member.roles.includes(settings.adminRoleID)) return true;
  return settings.modRoleIDs.some((id) => member.roles.includes(id));
};

botCache.helpers.isAdmin = (message, settings) => {
  const member = message.member();
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
    channel,
    { content: message.content, embed: message.embeds[0] },
  );
  if (!newMessage) return;

  deleteMessage(message);
  return newMessage;
};
