import {
  cache,
  chooseRandom,
  editChannel,
  sendMessage,
} from "../../../../deps.ts";
import {
  createSubcommand,
  sendAlertResponse,
  sendResponse,
} from "../../../utils/helpers.ts";
import { botCache } from "../../../../cache.ts";
import { translate } from "../../../utils/i18next.ts";
import { db } from "../../../database/database.ts";

createSubcommand("shop", {
  name: "counting",
  botServerPermissions: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
  guildOnly: true,
  arguments: [
    { name: "id", type: "number", required: false },
    { name: "channelID", type: "snowflake", required: false },
  ],
  execute: async function (message, args: ShopCountingArgs, guild) {
    if (!guild) return;

    // List the items that user can buy
    if (!args.id) {
      const items = [
        `**__${translate(message.guildID, "commands/counting:BUFFS")}__**`,
        ...botCache.constants.counting.shop.filter((item) =>
          item.type === "buff"
        ).map((item) => {
          const text = translate(guild.id, item.name);
          const [label, ...description] = text.split(": ");
          return `**[${item.id}] $${item.cost} ${botCache.constants.emojis.coin} ${label}**\n\`${
            description.join(": ")
          }\``;
        }),
        "",
        `**__${translate(message.guildID, "commands/counting:DEBUFFS")}__**`,
        ...botCache.constants.counting.shop.filter((item) =>
          item.type === "debuff"
        ).map((item) => {
          const text = translate(guild.id, item.name);
          const [label, ...description] = text.split(": ");
          return `**[${item.id}] $${item.cost} ${botCache.constants.emojis.coin} ${label}**\n\`${
            description.join(": ")
          }\``;
        }),
      ];

      return sendResponse(message, ["", ...items].join("\n"));
    }

    // Buying an item
    const item = botCache.constants.counting.shop.find((i) => i.id === args.id);
    const messageChannel = guild.channels.get(message.channelID);
    if (!messageChannel) return botCache.helpers.reactError(message);

    if (!item) {
      if (messageChannel.topic?.includes("gamerCounting")) return;
      return botCache.helpers.reactError(message);
    }

    const usersettings = await db.users.get(message.author.id);
    if (!usersettings) {
      if (messageChannel.topic?.includes("gamerCounting")) return;
      return botCache.helpers.reactError(message);
    }

    // Validate cost
    if (usersettings.coins < item.cost) {
      if (messageChannel.topic?.includes("gamerCounting")) return;
      return botCache.helpers.reactError(message);
    }

    // Buy the item
    if (item.type === "buff") {
      const settings = await db.counting.get(message.channelID);
      if (!settings) {
        if (messageChannel.topic?.includes("gamerCounting")) return;
        return botCache.helpers.reactError(message);
      }

      switch (item.id) {
        // Immunity Buff
        case 2:
          sendAlertResponse(
            message,
            translate(message.guildID, "commands/counting:DOUBLE_TIME_ON"),
          );
          db.counting.update(message.channelID, { debuffs: [] });
          break;
        // Math quiz
        case 3:
          if (messageChannel.topic?.includes("gamerCounting")) return;
          return botCache.helpers.reactError(message);
          // const question =
        //   `${first}^${second} + (${third} * ${fourth}) - ${first} / ${sixth}`;
        // Remove random debug
        case 4: {
          const random = chooseRandom(settings.debuffs);
          if (random) {
            db.counting.update(message.channelID, {
              debuffs: settings.debuffs.filter((debuff) => debuff !== random),
            });
          }
          break;
        }
        default:
          db.items.create(message.id, {
            game: "counting",
            channelID: message.channelID,
            memberID: message.author.id,
            itemID: item.id,
            type: item.type,
            guildID: message.guildID,
            // Item # 1 expires in 5 minutes.
            expiresAt: Date.now() + botCache.constants.milliseconds.MINUTE * 5,
          });

          db.counting.update(
            message.channelID,
            { buffs: [...settings.buffs, item.id] },
          );
      }
    } else {
      if (!args.channelID || !cache.channels.has(args.channelID)) {
        if (messageChannel.topic?.includes("gamerCounting")) return;
        return botCache.helpers.reactError(message);
      }

      const settings = await db.counting.get(message.channelID);
      if (!settings) {
        if (messageChannel.topic?.includes("gamerCounting")) return;
        return botCache.helpers.reactError(message);
      }

      // Make sure this is allowed
      if (settings.localOnly && settings.guildID !== message.guildID) {
        if (messageChannel.topic?.includes("gamerCounting")) return;
        return botCache.helpers.reactError(message);
      }

      const channel = cache.channels.get(args.channelID)!;

      if (!botCache.vipGuildIDs.has(message.guildID)) {
        // Tell them who debuffed them
        const username =
          `${message.author.username}#${message.author.discriminator}`;
        sendMessage(
          channel.id,
          `${username} (${message.author.id}) | #${messageChannel.name} (${message.channelID}) |  ${guild.name} (${guild.id})`,
        );
      }

      // username, user id, channel name, channel id, server name and server id
      switch (item.id) {
        // Remove 100 counts
        case 6: {
          const newValue = settings.count > 100 ? settings.count - 100 : 0;
          db.counting.update(args.channelID, { count: newValue });
          sendMessage(
            channel.id,
            translate(
              message.guildID,
              "commands/counting:STEAL_ON",
              { amount: newValue },
            ),
          );
          break;
        }
        // Activate slowmode on enemy
        case 7:
          sendMessage(
            channel.id,
            translate(message.guildID, "commands/counting:SLOWMODE_ON"),
          );
          editChannel(
            channel.id,
            { slowmode: botCache.constants.milliseconds.HOUR / 1000 },
          );
          db.items.create(message.id, {
            game: "counting",
            channelID: message.channelID,
            memberID: message.author.id,
            itemID: item.id,
            type: item.type,
            guildID: message.guildID,
            expiresAt: Date.now() + botCache.constants.milliseconds.HOUR,
          });
          break;
        case 8: {
          const randomAmount = Math.floor(Math.random() * 100) + 1;
          const randomChange = settings.count > randomAmount
            ? settings.count - randomAmount
            : 0;
          db.counting.update(args.channelID, { count: randomChange });
          sendMessage(
            channel.id,
            translate(
              message.guildID,
              "commands/counting:THIEF_ON",
              { random: randomAmount, now: randomChange },
            ),
          );
          break;
        }
        case 9:
          db.items.create(message.id, {
            game: "counting",
            channelID: message.channelID,
            memberID: message.author.id,
            itemID: item.id,
            type: item.type,
            guildID: message.guildID,
            expiresAt: Date.now() + botCache.constants.milliseconds.HOUR,
            currentCount: settings.count,
          });
          sendMessage(
            channel.id,
            translate(message.guildID, "commands/counting:QUICK_THINKING_ON"),
          );
          break;
        default:
          db.counting.update(
            message.channelID,
            { debuffs: [...settings.debuffs, item.id] },
          );
          break;
      }
    }

    db.users.update(
      message.author.id,
      { coins: usersettings.coins - item.cost },
    );
  },
});

interface ShopCountingArgs {
  id?: number;
  channelID?: string;
}
