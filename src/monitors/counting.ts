import { botCache } from "../../cache.ts";
import {
  addRole,
  bgBlue,
  bgYellow,
  black,
  cache,
  createWebhook,
  delay,
  executeWebhook,
  getChannelWebhooks,
  Message,
} from "../../deps.ts";
import { db } from "../database/database.ts";
import { getTime } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";
import { parsePrefix } from "./commandHandler.ts";

/** channelID, userID */
const lastCounterUserIDs = new Map<string, string>();
/** channelID */
const disabledChannelIDs = new Set<string>();

async function failedCount(message: Message, numberShouldBe: number, loserRoleID: string) {
  disabledChannelIDs.add(message.channelID);

  // If a loser role is set assign it
  if (loserRoleID) {
    await addRole(message.guildID, message.author.id, loserRoleID).catch(console.log);
  }

  if (lastCounterUserIDs.get(message.channelID) === message.author.id) {
    await message.reply(translate(message.guildID, "strings:COUNTING_ONLY_ONCE"));
    lastCounterUserIDs.delete(message.channelID);
    await message.send(translate(message.guildID, "strings:COUNTING_DISABLED"));
    await delay(60000);

    disabledChannelIDs.delete(message.channelID);
    await message.reply(translate(message.guildID, "strings:COUNTING_RESET"));
    await db.counting.update(message.channelID, { count: 0 });

    lastCounterUserIDs.delete(message.channelID);
    await message.send(translate(message.guildID, "strings:COUNTING_ENABLED"));

    return;
  }

  // Explains the reason.
  await message.reply(
    translate(message.guildID, "strings:COUNTING_BAD_COUNT", {
      count: numberShouldBe,
    })
  );
  // Allow users to save their count
  if (message.guildID !== botCache.constants.botSupportServerID) {
    if (botCache.activeMembersOnSupportServer.has(message.author.id)) {
      await message.alertReply(translate(message.guildID, "strings:COUNTING_ALREADY_ACTIVE"));
      await message.send(
        translate(message.guildID, "strings:COUNTING_NEW_COUNT", {
          amount: numberShouldBe,
        })
      );
      disabledChannelIDs.delete(message.channelID);
      return;
    } else {
      const saveRequest = await message.reply(
        translate(message.guildID, "strings:COUNTING_QUICK_SAVE", {
          invite: botCache.constants.botSupportInvite,
        })
      );
      if (!saveRequest) {
        // TODO: IDK
        disabledChannelIDs.delete(message.channelID);
        return;
      }

      if (saveRequest) {
        saveRequest
          .delete(translate(message.guildID, "strings:CLEAR_SPAM"), botCache.constants.milliseconds.MINUTE)
          .catch(console.log);

        const saved = await botCache.helpers.needMessage(message.author.id, "549976097996013574", {
          duration: botCache.constants.milliseconds.MINUTE,
        });
        if (saved) {
          message.alertReply(translate(message.guildID, "strings:COUNTING_SAVED")).catch(console.log);
          await message.send(
            translate(message.guildID, "strings:COUNTING_NEW_COUNT", {
              amount: numberShouldBe,
            })
          );
          disabledChannelIDs.delete(message.channelID);
          return;
        }
      }
    }
  }

  await message.send(translate(message.guildID, "strings:COUNTING_DISABLED"));
  disabledChannelIDs.add(message.channelID);
  await delay(60000);
  await db.counting.update(message.channelID, { count: 0 });
  disabledChannelIDs.delete(message.channelID);
  await message.send(translate(message.guildID, "strings:COUNTING_ENABLED"));

  return;
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
    // If this is not a counting channel
    if (!botCache.countingChannelIDs.has(message.channelID)) return;
    // If counting is disabled in this channel
    if (disabledChannelIDs.has(message.channelID)) return;

    console.log(`${bgBlue(`[${getTime()}]`)} => [MONITOR: ${bgYellow(black("counting"))}] Executed.`);

    if (message.content.startsWith(`${parsePrefix(message.guildID)}shop`)) {
      return message.delete(translate(message.guildID, "strings:CLEAR_SPAM"));
    }

    const settings = await db.counting.get(message.channelID);
    if (!settings) return;

    // 1,000 or 1.000 different countries use them.
    const number = Number(message.content.replace(/[.,]/g, ""));

    // If the message is not a valid number delete it
    if (!number && number !== 0) {
      if (settings.deleteInvalid) {
        return message.delete(translate(message.guildID, "strings:CLEAR_SPAM"));
      }
    }

    // A valid number was entered
    let numberShouldBe = settings.count + 1;
    if (settings.buffs.includes(1)) ++numberShouldBe;

    const lastCounterUserID = lastCounterUserIDs.get(message.channelID);
    if (lastCounterUserID === message.author.id && !settings.buffs.includes(5)) {
      return failedCount(message, numberShouldBe, settings.loserRoleID);
    }

    // User broke the count.
    if (number < 1 || numberShouldBe !== number) {
      return failedCount(message, numberShouldBe, settings.loserRoleID);
    }

    // Valid count
    await db.counting.update(message.channelID, { count: numberShouldBe });

    lastCounterUserIDs.set(message.channelID, message.author.id);

    const member = cache.members.get(message.author.id);

    // Check if this channel has a cached webhook
    const existingWebhook = botCache.webhooks.get(message.channelID);
    if (existingWebhook) {
      await message.delete().catch(console.log);
      return executeWebhook(existingWebhook.webhookID, existingWebhook.token, {
        content: message.content,
        username: member?.tag,
        avatar_url: member?.avatarURL,
        mentions: { parse: [] },
      });
    }

    // Webhook wasn't cached see if one exists in the channel
    const channelWebhooks = await getChannelWebhooks(message.channelID);
    const validHook = channelWebhooks.find((w) => w.token && w.id);
    if (validHook) {
      await message.delete().catch(console.log);
      // Add webhook to cache for next time
      botCache.webhooks.set(message.channelID, {
        webhookID: validHook.id,
        token: validHook.token!,
        id: message.channelID,
      });
      return executeWebhook(validHook.id, validHook.token!, {
        content: message.content,
        username: member?.tag,
        avatar_url: member?.avatarURL,
        mentions: { parse: [] },
      });
    }

    // A new webhook should be created
    const webhook = await createWebhook(message.channelID, { name: "Gamer" });
    if (webhook.token) {
      await message.delete().catch(console.log);
      // Add to cache,
      botCache.webhooks.set(message.channelID, {
        webhookID: webhook.id,
        token: webhook.token,
        id: message.channelID,
      });
      return executeWebhook(webhook.id, webhook.token, {
        content: message.content,
        username: member?.tag,
        avatar_url: member?.avatarURL,
        mentions: { parse: [] },
      });
    }

    return botCache.helpers.reactSuccess(message);
  },
});
