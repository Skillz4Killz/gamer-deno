import { botCache } from "../../mod.ts";
import { guildsDatabase } from "../database/schemas/guilds.ts";
import {
  botHasChannelPermissions,
  Permissions,
  addReactions,
  deleteMessage,
} from "../../deps.ts";

botCache.helpers.todoReactionHandler = async function (message, emoji, userID) {
  const settings = await guildsDatabase.findOne(
    { guildID: message.channel.guildID },
  );
  if (!settings) return;

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
