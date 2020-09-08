import {
  cache,
  editChannel,
  sendMessage,
} from "../../deps.ts";
import { botCache } from "../../mod.ts";
import { itemsDatabase } from "../database/schemas/items.ts";
import { countingDatabase } from "../database/schemas/counting.ts";
import { translate } from "../utils/i18next.ts";

botCache.tasks.set(`items`, {
  name: `items`,
  interval: botCache.constants.milliseconds.MINUTE,
  execute: async function () {
    const itemsToExpire = await itemsDatabase.find(
      { expiresAt: { $lte: Date.now() } },
    );
    if (!itemsToExpire.length) return;

    itemsToExpire.forEach(async (item) => {
      // Counting game handling
      if (item.game === "counting") {
        const settings = await countingDatabase.findOne(
          { channelID: item.channelID },
        );

        // Remove the buff from this channel
        countingDatabase.updateOne({ channelID: item.channelID }, {
          $set: {
            buffs: settings?.buffs.filter((b) => b !== item.itemID) || [],
          },
        });

        switch (item.itemID) {
          case 2:
            if (cache.channels.has(item.channelID)) {
              sendMessage(
                cache.channels.get(item.channelID)!,
                translate(item.guildID, "commands/counting:DOUBLE_TIME_OFF"),
              );
            }
            break;
          case 5:
            if (cache.channels.has(item.channelID)) {
              sendMessage(
                cache.channels.get(item.channelID)!,
                translate(item.guildID, "commands/counting:SOLO_LEVELING_OFF"),
              );
            }
            break;
          case 7:
            if (cache.channels.has(item.channelID)) {
              editChannel(
                cache.channels.get(item.channelID)!,
                { rate_limit_per_user: 0 },
              );
              sendMessage(
                cache.channels.get(item.channelID)!,
                translate(item.guildID, "commands/counting:SLOWMODE_OFF"),
              );
            }
          case 9:
            if (cache.channels.has(item.channelID)) {
              sendMessage(
                cache.channels.get(item.channelID)!,
                translate(item.guildID, "commands/counting:QUICK_THINKING_OFF"),
              );
            }
            // Were not able to count 100 times, in the time allowed
            if (
              settings && item.currentCount &&
              (settings.count < item.currentCount + 100)
            ) {
              sendMessage(
                cache.channels.get(item.channelID)!,
                translate(
                  item.guildID,
                  "commands/counting:QUICK_THINKING_FAILED",
                ),
              );

              countingDatabase.updateOne(
                { channelID: item.channelID },
                { $set: { count: 0 } },
              );
            }
            break;
          default:
            break;
        }
      }
    });
  },
});
