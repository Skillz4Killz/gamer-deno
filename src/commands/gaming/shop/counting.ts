import {
  cache,
  chooseRandom,
  editChannel,
  sendMessage,
} from "../../../../deps.ts";
import {
  createSubcommand,
  sendResponse,
  sendAlertResponse,
} from "../../../utils/helpers.ts";
import { countingDatabase } from "../../../database/schemas/counting.ts";
import { itemsDatabase } from "../../../database/schemas/items.ts";
import { usersDatabase } from "../../../database/schemas/users.ts";
import { botCache } from "../../../../mod.ts";
import { translate } from "../../../utils/i18next.ts";

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
          const [label, ...description] = item.name.split(": ");
          return `**[${item.id}] $${item.cost} ${botCache.constants.emojis.coin} ${label}**\n\`${
            description.join(": ")
          }\``;
        }),
        "",
        `**__${translate(message.guildID, "commands/counting:DEBUFFS")}__**`,
        ...botCache.constants.counting.shop.filter((item) =>
          item.type === "debuff"
        ).map((item) => {
          const [label, ...description] = item.name.split(": ");
          return `**[${item.id}] $${item.cost} ${botCache.constants.emojis.coin} ${label}**\n\`${
            description.join(": ")
          }\``;
        }),
      ];

      return sendResponse(message, ["", ...items].join("\n"));
    }

    // Buying an item
    const item = botCache.constants.counting.shop.find((i) => i.id === args.id);
    if (!item) {
      if (message.channel.topic?.includes("gamerCounting")) return;
      return botCache.helpers.reactError(message);
    }

    const usersettings = await usersDatabase.findOne(
      { userID: message.author.id },
    );
    if (!usersettings) {
      if (message.channel.topic?.includes("gamerCounting")) return;
      return botCache.helpers.reactError(message);
    }

    // Validate cost
    if (usersettings.coins < item.cost) {
      if (message.channel.topic?.includes("gamerCounting")) return;
      return botCache.helpers.reactError(message);
    }

    // Buy the item
    if (item.type === "buff") {
      const settings = await countingDatabase.findOne(
        { channelID: message.channelID },
      );
      if (!settings) {
        if (message.channel.topic?.includes("gamerCounting")) return;
        return botCache.helpers.reactError(message);
      }

      switch (item.id) {
        // Immunity Buff
        case 2:
          sendAlertResponse(
            message,
            translate(message.guildID, "commands/counting:DOUBLE_TIME_ON"),
          );
          countingDatabase.updateOne({ channelID: message.channelID }, {
            $set: { debuffs: [] },
          });
          break;
        // Math quiz
        case 3:
          if (message.channel.topic?.includes("gamerCounting")) return;
          return botCache.helpers.reactError(message);
          // const question =
        //   `${first}^${second} + (${third} * ${fourth}) - ${first} / ${sixth}`;
        // Remove random debug
        case 4: {
          const random = chooseRandom(settings.debuffs);
          if (random) {
            countingDatabase.updateOne({ channelID: message.channelID }, {
              $set: {
                debuffs: settings.debuffs.filter((debuff) => debuff !== random),
              },
            });
          }
          break;
        }
        default:
          itemsDatabase.insertOne({
            game: "counting",
            channelID: message.channelID,
            memberID: message.author.id,
            itemID: item.id,
            type: item.type,
            guildID: message.guildID,
            // Item # 1 expires in 5 minutes.
            expiresAt: Date.now() + botCache.constants.milliseconds.MINUTE * 5,
          });

          countingDatabase.updateOne(
            { channelID: message.channelID },
            { $set: { buffs: [...settings.buffs, item.id] } },
          );
      }
    } else {
      if (!args.channelID || !cache.channels.has(args.channelID)) {
        if (message.channel.topic?.includes("gamerCounting")) return;
        return botCache.helpers.reactError(message);
      }

      const settings = await countingDatabase.findOne(
        { channelID: message.channelID },
      );
      if (!settings) {
        if (message.channel.topic?.includes("gamerCounting")) return;
        return botCache.helpers.reactError(message);
      }

      // Make sure this is allowed
      if (settings.localOnly && settings.guildID !== message.guildID) {
        if (message.channel.topic?.includes("gamerCounting")) return;
        return botCache.helpers.reactError(message);
      }

      const channel = cache.channels.get(args.channelID)!;

      if (!botCache.vipGuildIDs.has(message.guildID)) {
        // Tell them who debuffed them
        const member = message.member();
        const username = member?.tag ||
          `${message.author.username}#${message.author.discriminator}`;
        sendMessage(
          channel,
          `${username} (${message.author.id}) | #${message.channel.name} (${message.channelID}) |  ${guild.name} (${guild.id})`,
        );
      }

      // username, user id, channel name, channel id, server name and server id
      switch (item.id) {
        // Remove 100 counts
        case 6: {
          const newValue = settings.count > 100 ? settings.count - 100 : 0;
          countingDatabase.updateOne({ channelID: args.channelID }, {
            $set: { count: newValue },
          });
          sendMessage(
            channel,
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
            channel,
            translate(message.guildID, "commands/counting:SLOWMODE_ON"),
          );
          editChannel(
            channel,
            {
              rate_limit_per_user: botCache.constants.milliseconds.HOUR / 1000,
            },
          );
          itemsDatabase.insertOne({
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
          countingDatabase.updateOne({ channelID: args.channelID }, {
            $set: { count: randomChange },
          });
          sendMessage(
            channel,
            translate(
              message.guildID,
              "commands/counting:THIEF_ON",
              { random: randomAmount, now: randomChange },
            ),
          );
          break;
        }
        case 9:
          itemsDatabase.insertOne({
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
            channel,
            translate(message.guildID, "commands/counting:QUICK_THINKING_ON"),
          );
          break;
        default:
          countingDatabase.updateOne(
            { channelID: message.channelID },
            { $set: { debuffs: [...settings.debuffs, item.id] } },
          );
          break;
      }
    }

    usersDatabase.updateOne({
      userID: message.author.id,
    }, { $set: { coins: usersettings.coins - item.cost } });
  },
});

interface ShopCountingArgs {
  id?: number;
  channelID?: string;
}
