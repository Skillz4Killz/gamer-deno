import {
  addRole,
  bgBlue,
  bgYellow,
  black,
  cache,
  Collection,
  createWebhook,
  delay,
  deleteMessage,
  deleteMessageByID,
  executeWebhook,
  getChannelWebhooks,
  Message,
  sendMessage,
} from "../../deps.ts";
import { parsePrefix } from "./commandHandler.ts";
import { botCache } from "../../cache.ts";
import { translate } from "../utils/i18next.ts";
import { getTime, sendAlertResponse, sendResponse } from "../utils/helpers.ts";
import { db } from "../database/database.ts";

// ChannelID, UserID
const lastCounterUserIDs = new Collection<string, string>();
// ChannelID
const disabled = new Set<string>();

async function failedCount(
  message: Message,
  count: number,
  loserRoleID?: string,
) {
  // Alerts the user that it was invalid
  botCache.helpers.reactError(message);
  // If a role is set to be assigned assign it.
  if (loserRoleID) {
    addRole(message.guildID, message.author.id, loserRoleID).catch(
      () => undefined,
    );
  }

  if (lastCounterUserIDs.get(message.channelID) === message.author.id) {
    sendResponse(
      message,
      translate(message.guildID, "strings:COUNTING_ONLY_ONCE"),
    );
    lastCounterUserIDs.delete(message.channelID);
    sendMessage(
      message.channelID,
      translate(message.guildID, "strings:COUNTING_DISABLED"),
    );
    disabled.add(message.channelID);
    setTimeout(() => {
      disabled.delete(message.channelID);
      sendMessage(
        message.channelID,
        translate(message.guildID, "strings:COUNTING_ENABLED"),
      );
    }, 60000);
    return true;
  }

  // Explains the reason.
  sendResponse(
    message,
    translate(message.guildID, "strings:COUNTING_BAD_COUNT", { count }),
  );
  // Allow users to save their count
  if (message.guildID !== botCache.constants.botSupportServerID) {
    if (
      botCache.activeMembersOnSupportServer.has(message.author.id)
    ) {
      sendAlertResponse(
        message,
        translate(message.guildID, "strings:COUNTING_ALREADY_ACTIVE"),
      );
      sendMessage(
        message.channelID,
        translate(
          message.guildID,
          "strings:COUNTING_NEW_COUNT",
          { amount: count.toLocaleString() },
        ),
      );
      return false;
    } else {
      const saveRequest = await sendResponse(
        message,
        translate(
          message.guildID,
          "strings:COUNTING_QUICK_SAVE",
          { invite: botCache.constants.botSupportInvite },
        ),
      );
      await delay(botCache.constants.milliseconds.MINUTE);
      deleteMessage(
        saveRequest,
        translate(message.guildID, "strings:CLEAR_SPAM"),
      );
      if (botCache.activeMembersOnSupportServer.has(message.author.id)) {
        sendAlertResponse(
          message,
          translate(message.guildID, "strings:COUNTING_SAVED"),
        );
        sendMessage(
          message.channelID,
          translate(
            message.guildID,
            "strings:COUNTING_NEW_COUNT",
            { amount: count.toLocaleString() },
          ),
        );
        return false;
      }
    }
  }

  sendMessage(
    message.channelID,
    translate(message.guildID, "strings:COUNTING_DISABLED"),
  );
  disabled.add(message.channelID);
  setTimeout(() => {
    disabled.delete(message.channelID);
    sendMessage(
      message.channelID,
      translate(message.guildID, "strings:COUNTING_ENABLED"),
    );
  }, 60000);
  return true;
}

botCache.monitors.set("counting", {
  name: "counting",
  botChannelPermissions: [
    "SEND_MESSAGES",
    "MANAGE_MESSAGES",
    "ADD_REACTIONS",
    "USE_EXTERNAL_EMOJIS",
    "READ_MESSAGE_HISTORY",
    "MANAGE_WEBHOOKS",
  ],
  execute: async function (message) {
    // If this is not a support channel
    if (
      !cache.channels.get(message.channelID)?.topic?.includes("gamerCounting")
    ) {
      return;
    }

    if (disabled.has(message.channelID)) return;

    console.log(
      `${bgBlue(`[${getTime()}]`)} => [MONITOR: ${
        bgYellow(black("counting"))
      }] Executed.`,
    );
    // 1,000 or 1.000 different countries use them.
    const number = Number(
      message.content.replace(/[.,]/g, ""),
    );

    // If the shop command is being used, we should simply cancel out.
    if (
      message.content.startsWith(`${parsePrefix(message.guildID)}shop`)
    ) {
      return deleteMessage(
        message,
        translate(message.guildID, "strings:CLEAR_SPAM"),
      ).catch(() => undefined);
    }

    const settings = await db.counting.get(message.channelID);
    if (!settings) return;

    // If the message is not a valid number delete it
    if (!number && number !== 0) {
      if (settings.deleteInvalid) {
        return deleteMessage(
          message,
          translate(message.guildID, "strings:CLEAR_SPAM"),
          10,
        ).catch(() => undefined);
      }
    }

    // A valid number was entered.

    let numberShouldBe = settings.count + 1;
    if (settings.buffs.includes(1)) numberShouldBe++;

    const lastCounterUserID = lastCounterUserIDs.get(message.channelID);
    if (
      lastCounterUserID === message.author.id && !settings.buffs.includes(5)
    ) {
      const failed = await failedCount(
        message,
        numberShouldBe,
        settings.loserRoleID,
      );
      if (failed) {
        sendResponse(
          message,
          translate(message.guildID, "strings:COUNTING_RESET"),
        );
        db.counting.update(message.channelID, { count: 0 });
        lastCounterUserIDs.delete(message.channelID);
        return;
      }
    }

    // User broke the count.
    if (number < 1 || (numberShouldBe !== number)) {
      const failed = await failedCount(
        message,
        numberShouldBe,
        settings.loserRoleID,
      );
      if (failed) {
        sendResponse(
          message,
          translate(message.guildID, "strings:COUNTING_RESET"),
        );
        db.counting.update(message.channelID, { count: 0 });
        return;
      }
    }

    // Valid count
    db.counting.update(message.channelID, { count: numberShouldBe });

    lastCounterUserIDs.set(message.channelID, message.author.id);

    const member = cache.members.get(message.author.id);

    // Check if this channel has a cached webhook
    const existingWebhook = botCache.webhooks.get(message.channelID);
    if (existingWebhook) {
      deleteMessageByID(message.channelID, message.id).catch(() => undefined);
      return executeWebhook(
        existingWebhook.webhookID,
        existingWebhook.token,
        {
          content: message.content,
          username: member?.tag,
          avatar_url: member?.avatarURL,
          mentions: { parse: [] },
        },
      );
    }

    // Webhook wasn't cached see if one exists in the channel
    const channelWebhooks = await getChannelWebhooks(message.channelID);
    if (channelWebhooks.length) {
      deleteMessageByID(message.channelID, message.id).catch(() => undefined);
      const [webhook] = channelWebhooks;
      // Add webhook to cache for next time
      botCache.webhooks.set(
        message.channelID,
        { webhookID: webhook.id, token: webhook.token, id: message.channelID },
      );
      return executeWebhook(
        webhook.id,
        webhook.token,
        {
          content: message.content,
          username: member?.tag,
          avatar_url: member?.avatarURL,
          mentions: { parse: [] },
        },
      );
    }

    // A new webhook should be created
    const webhook = await createWebhook(message.channelID, { name: "Gamer" });
    if (webhook.token) {
      deleteMessageByID(message.channelID, message.id).catch(() => undefined);
      // Add to cache,
      botCache.webhooks.set(
        message.channelID,
        { webhookID: webhook.id, token: webhook.token, id: message.channelID },
      );
      return executeWebhook(
        webhook.id,
        webhook.token,
        {
          content: message.content,
          username: member?.tag,
          avatar_url: member?.avatarURL,
          mentions: { parse: [] },
        },
      );
    }

    return botCache.helpers.reactSuccess(message);
  },
});
