import { cache, editChannel, sendMessage, snowflakeToBigint } from "../../deps.ts";
import { botCache } from "../../deps.ts";
import { db } from "../database/database.ts";
import { translate } from "../utils/i18next.ts";

botCache.tasks.set(`items`, {
  name: `items`,
  interval: botCache.constants.milliseconds.MINUTE,
  execute: async function () {
    const itemsToExpire = await db.items.getAll();
    const now = Date.now();

    itemsToExpire.forEach(async (item) => {
      if (item.expiresAt > now) return;

      // Counting game handling
      if (item.game === "counting") {
        const settings = await db.counting.get(item.channelID);

        // Remove the buff from this channel
        await db.counting.update(item.channelID, {
          buffs: settings?.buffs.filter((b) => b !== item.itemID) || [],
          debuffs: settings?.debuffs.filter((b) => b !== item.itemID) || [],
        });

        switch (item.itemID) {
          case 2:
            if (cache.channels.has(snowflakeToBigint(item.channelID))) {
              await sendMessage(snowflakeToBigint(item.channelID), translate(item.guildID, "COUNTING_DOUBLE_TIME_OFF"));
            }
            break;
          case 5:
            if (cache.channels.has(snowflakeToBigint(item.channelID))) {
              await sendMessage(
                snowflakeToBigint(item.channelID),
                translate(item.guildID, "COUNTING_SOLO_LEVELING_OFF")
              );
            }
            break;
          case 7:
            if (cache.channels.has(snowflakeToBigint(item.channelID))) {
              await editChannel(snowflakeToBigint(item.channelID), { rateLimitPerUser: 0 });
              await sendMessage(snowflakeToBigint(item.channelID), translate(item.guildID, "COUNTING_SLOWMODE_OFF"));
            }
            break;
          case 9:
            if (cache.channels.has(snowflakeToBigint(item.channelID))) {
              await sendMessage(
                snowflakeToBigint(item.channelID),
                translate(item.guildID, "COUNTING_QUICK_THINKING_OFF")
              );
            }
            // Were not able to count 100 times, in the time allowed
            if (settings && item.currentCount && settings.count < item.currentCount + 100) {
              await sendMessage(
                snowflakeToBigint(item.channelID),
                translate(item.guildID, "COUNTING_QUICK_THINKING_FAILED")
              );

              await db.counting.update(item.channelID.toString(), { count: 0 });
            }
            break;
          default:
            break;
        }
      }

      await db.items.delete(item.id);
    });
  },
});
