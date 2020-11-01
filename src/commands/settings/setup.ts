import { Message, OverwriteType } from "../../../deps.ts";
import {
  addReactions,
  botID,
  createGuildChannel,
  deleteChannel,
  followChannel,
  sendMessage,
} from "../../../deps.ts";
import { botCache } from "../../../cache.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { sendResponse } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

const yesEmojiID = botCache.helpers.emojiID(botCache.constants.emojis.success);
const quitEmojiID = botCache.helpers.emojiID(botCache.constants.emojis.quit);
const reactions = [
  botCache.constants.emojis.success,
  botCache.constants.emojis.failure,
  botCache.constants.emojis.quit,
];

function confirmedCancel(message: Message, channelID: string) {
  sendResponse(
    message,
    translate(message.guildID, "commands/setup:CANCELLED"),
  );

  deleteChannel(message.guildID, channelID);
}

function cancelSetup(message: Message, responseMessage: Message) {
  const CANCEL_OPTIONS = translate(
    message.guildID,
    "common:CANCEL_OPTIONS",
    { returnObjects: true },
  );

  if (
    !CANCEL_OPTIONS.includes(responseMessage.content.toLowerCase())
  ) {
    return false;
  }

  confirmedCancel(message, responseMessage.channelID);
  return true;
}

botCache.commands.set("setup", {
  name: "setup",
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  botServerPermissions: ["ADMINISTRATOR"],
  cooldown: {
    seconds: 120,
    allowedUses: 2,
  },
  execute: async function (message, args, guild) {
    if (!guild) return;

    const mention = `<@!${message.author.id}>`;

    sendResponse(
      message,
      translate(message.guildID, "commands/setup:PREPARING"),
    );

    // Create the setup spam channel
    const setupChannel = await createGuildChannel(guild, "gamer-setup", {
      position: 1,
      permission_overwrites: [
        {
          id: botID,
          allow: [
            "VIEW_CHANNEL",
            "SEND_MESSAGES",
            "EMBED_LINKS",
            "ADD_REACTIONS",
            "READ_MESSAGE_HISTORY",
            "MANAGE_CHANNELS",
            "USE_EXTERNAL_EMOJIS",
          ],
          deny: [],
          type: OverwriteType.MEMBER,
        },
        {
          id: message.author.id,
          allow: [
            "VIEW_CHANNEL",
            "SEND_MESSAGES",
            "EMBED_LINKS",
            "ADD_REACTIONS",
            "READ_MESSAGE_HISTORY",
            "MANAGE_CHANNELS",
            "USE_EXTERNAL_EMOJIS",
          ],
          deny: [],
          type: OverwriteType.MEMBER,
        },
      ],
    });

    // Thank the user for using Gamer! And get them into the setup channel
    await sendMessage(
      setupChannel.id,
      translate(
        message.guildID,
        "commands/setup:BEGIN",
        { mention },
      ),
    );

    const CANCEL_OPTIONS = translate(
      message.guildID,
      "common:CANCEL_OPTIONS",
      { returnObjects: true },
    );

    // Ask first question.
    const beginMessage = await sendMessage(
      setupChannel.id,
      translate(
        message.guildID,
        "commands/setup:SUBSCRIBE_QUESTION",
        { mention },
      ),
    );
    await addReactions(beginMessage.channelID, beginMessage.id, reactions);
    const subscribe = await botCache.helpers.needReaction(
      message.author.id,
      beginMessage.id,
    );
    if (subscribe === quitEmojiID) {
      return confirmedCancel(message, setupChannel.id);
    }
    // The user wants to subscribe
    if (subscribe === yesEmojiID) {
      sendMessage(
        setupChannel.id,
        translate(message.guildID, "commands/setup:NEED_CHANNEL", { mention }),
      );
      const response = await botCache.helpers.needMessage(
        message.author.id,
        setupChannel.id,
      );
      if (cancelSetup(message, response)) return;

      const [targetChannel] = response.mentionChannels;
      // Subscribe to gamer news channels
      if (targetChannel) {
        followChannel("650349614104576021", targetChannel.id).then(() => {});
      }
    }

    // Step 2: Setup TODO Feature
    const todoMessage = await sendMessage(
      setupChannel.id,
      translate(message.guildID, "commands/setup:TODO_SETUP", { mention }),
    );
    await addReactions(todoMessage.channelID, todoMessage.id, reactions);
    const todo = await botCache.helpers.needReaction(
      message.author.id,
      todoMessage.id,
    );
    if (todo === quitEmojiID) return confirmedCancel(message, setupChannel.id);

    // The user wants to setup todo feature
    if (todo === yesEmojiID) {
      await botCache.commands.get("todo")
        ?.subcommands?.get("setup")
        ?.execute?.(message, {}, guild);
    }

    // Step 3: Unique Role Set
  },
});
