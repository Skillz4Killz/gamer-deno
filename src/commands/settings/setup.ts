import { addReactions, sendMessage, followChannel } from "../../../deps.ts";
import { botCache } from "../../../mod.ts";
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

botCache.commands.set("setup", {
  name: "setup",
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  botServerPermissions: ["ADMINISTRATOR"],
  cooldown: {
    seconds: 120,
    allowedUses: 2,
  },
  execute: async function (message) {
    // Thank the user for using Gamer!
    sendMessage(message.channel, "commands/setup:BEGIN");

    const CANCEL_OPTIONS = translate(
      message.guildID,
      "common:CANCEL_OPTIONS",
      { returnObjects: true },
    );

    // Ask first question.
    const beginMessage = await sendResponse(
      message,
      translate(message.guildID, "commands/setup:SUBSCRIBE_QUESTION"),
    );
    await addReactions(message.channelID, beginMessage.id, reactions);
    const subscribe = await botCache.helpers.needReaction(
      message.author.id,
      beginMessage.id,
    );
    if (subscribe === quitEmojiID) return;
    // The user wants to subscribe
    if (subscribe === yesEmojiID) {
      sendResponse(
        message,
        translate(message.guildID, "commands/setup:NEED_CHANNEL"),
      );
      const response = await botCache.helpers.needMessage(
        message.author.id,
        message.id,
        {
          filter: (msg) =>
            message.author.id === msg.author.id &&
            (CANCEL_OPTIONS.includes(msg.content.toLowerCase()) ||
              Boolean(msg.mentionChannels?.length)),
        },
      );
      if (
        !response || CANCEL_OPTIONS.includes(response.content)
      ) {
        return sendMessage(
          message.channel,
          translate(message.guildID, "commands/setup:CANCELLED"),
        );
      }

      const [targetChannel] = response.mentionChannels;
      // Subscribe to gamer news channels
      if (targetChannel) {
        followChannel("650349614104576021", targetChannel.id).then(() => {});
      }
    }

    // Step 2:
  },
});
