import { guildsDatabase } from "../database/schemas/guilds.ts";
import { botCache } from "../../mod.ts";
import {
  botHasChannelPermissions,
  cache,
  Permissions,
  addReactions,
  deleteMessage,
  memberIDHasPermission,
} from "../../deps.ts";

botCache.helpers.todoReactionHandler = async function (message, emoji, userID) {
  const settings = await guildsDatabase.findOne(
    { guildID: message.guildID },
  );
  if (!settings) return;

  const guild = cache.guilds.get(message.guildID);
  if (!guild) return;

  const member = guild.members.get(userID);
  if (!member) return;

  if (
    !member.roles.includes(settings.adminRoleID) &&
    !settings.modRoleIDs.some((id) => member.roles.includes(id)) &&
    !memberIDHasPermission(userID, guild.id, ["ADMINISTRATOR"])
  ) {
    return;
  }

  // If not in a related channel cancel out.
  if (
    ![
      settings.todoArchivedChannelID,
      settings.todoBacklogChannelID,
      settings.todoCompletedChannelID,
      settings.todoCurrentSprintChannelID,
      settings.todoNextSprintChannelID,
    ].includes(message.channelID)
  ) {
    return;
  }

  if (emoji.name === botCache.constants.emojis.todo.delete) {
    if (
      !botHasChannelPermissions(
        message.channelID,
        [Permissions.MANAGE_MESSAGES],
      )
    ) {
      return;
    }

    return deleteMessage(message);
  }

  const channelID = emoji.name === botCache.constants.emojis.todo.archived
    ? settings.todoArchivedChannelID
    : emoji.name === botCache.constants.emojis.todo.backlog
    ? settings.todoBacklogChannelID
    : emoji.name === botCache.constants.emojis.todo.completed
    ? settings.todoCompletedChannelID
    : emoji.name === botCache.constants.emojis.todo.current
    ? settings.todoCurrentSprintChannelID
    : emoji.name === botCache.constants.emojis.todo.next
    ? settings.todoNextSprintChannelID
    : undefined;

  if (!channelID || channelID === message.channelID) return;

  const movedMessage = await botCache.helpers.moveMessageToOtherChannel(
    message,
    channelID,
  );
  if (
    !movedMessage ||
    !botHasChannelPermissions(
      channelID,
      [Permissions.ADD_REACTIONS, Permissions.READ_MESSAGE_HISTORY],
    )
  ) {
    return;
  }

  return addReactions(
    channelID,
    movedMessage.id,
    Object.values(botCache.constants.emojis.todo),
    true,
  );
};
