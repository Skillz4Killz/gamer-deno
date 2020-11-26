import { botCache, cache, chooseRandom } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand, sendResponse } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

const allEmojis = [
  botCache.constants.emojis.snap,
  botCache.constants.emojis.slam,
  botCache.constants.emojis.dab,
  botCache.constants.emojis.success,
  botCache.constants.emojis.gamerHeart,
  botCache.constants.emojis.gamerHug,
  botCache.constants.emojis.gamerOnFire,
  botCache.constants.emojis.gamerCry,
  botCache.constants.emojis.bite,
  botCache.constants.emojis.pat,
  botCache.constants.emojis.poke,
  botCache.constants.emojis.lmao,
  botCache.constants.emojis.tantrum,
  botCache.constants.emojis.furious,
  botCache.constants.emojis.hurray,
  botCache.constants.emojis.starry,
  botCache.constants.emojis.heartthrob,
  botCache.constants.emojis.huh,
  botCache.constants.emojis.toastspinning,
  botCache.constants.emojis.twohundretIQ,
  botCache.constants.emojis.RemDance,
  botCache.constants.emojis.Aquaaah,
  botCache.constants.emojis.NezukoDance,
];

createCommand({
  name: "slots",
  cooldown: {
    seconds: 30,
    allowedUses: 6,
  },
  botChannelPermissions: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "USE_EXTERNAL_EMOJIS",
  ],
  execute: async function (message) {
    const emojis = [];

    // This allows us to add as many emojis we want but the odds remain the same. More unique emojis help spam feel less spam and more users want to join gamer server to get access to those emojis.
    while (emojis.length < 10) {
      emojis.push(chooseRandom(allEmojis));
    }

    const row1 = [];
    const row2 = [];
    const row3 = [];

    for (let i = 0; i < 9; i++) {
      const emoji = chooseRandom(emojis);
      if (row1.length < 3) row1.push(emoji);
      else if (row2.length < 3) row2.push(emoji);
      else row3.push(emoji);
    }

    const winningSet = new Set(row2);
    const topSet = new Set(row1);
    const bottomSet = new Set(row3);

    let response = "strings:SLOTS_LOSER";
    let finalAmount = 1;

    const isSupporter = botCache.activeMembersOnSupportServer.has(
      message.author.id,
    );

    const userSettings = await db.users.get(message.author.id);
    if (!userSettings) return;

    // If they lost all three are unique emojis
    if (winningSet.size === 3) {
      if (userSettings.coins > 0) {
        if (userSettings.coins < 2) userSettings.coins -= 1;
        else {
          userSettings.coins -= 2;
          response = "strings:SLOTS_LOSER_MULTI";
        }
      } else {
        userSettings.coins += 1;
        response = "strings:SLOTS_FREEBIE";
      }
    } // If 2 of them were the same emoji
    else if (winningSet.size === 2) {
      response = "strings:SLOTS_WINNER_PARTIAL";
      finalAmount *= 10;
      userSettings.coins += finalAmount * (isSupporter ? 2 : 1);
    } // If all three emojis are the same. WINNER!
    else {
      // All three rows were winners
      if (bottomSet.size === 1 && topSet.size === 1) {
        const winningEmoji = [...winningSet][0];
        // All 9 emojis are the same
        if (
          winningEmoji === [...topSet][0] && winningEmoji === [...bottomSet][0]
        ) {
          response = "strings:SLOTS_WINNER_COMPLETE";
          finalAmount *= 5000;
          userSettings.coins += finalAmount * (isSupporter ? 2 : 1);
        } // The rows are different
        else {
          response = "strings:SLOTS_WINNER_LUCKY";
          finalAmount *= 1000;
          userSettings.coins += finalAmount * (isSupporter ? 2 : 1);
        }
      } // 2 rows were all the same emoji
      else if (bottomSet.size === 1 || topSet.size === 1) {
        response = "strings:SLOTS_WINNER_MULTIPLE";
        finalAmount *= 500;
        userSettings.coins += finalAmount * (isSupporter ? 2 : 1);
      } // Only one row was the same
      else {
        response = "strings:SLOTS_WINNER_FULL";
        finalAmount *= 100;
        userSettings.coins += finalAmount * (isSupporter ? 2 : 1);
      }
    }

    db.users.update(message.author.id, userSettings);

    const details = [
      translate(
        message.guildID,
        response,
        { amount: finalAmount, emoji: botCache.constants.emojis.coin },
      ),
    ];
    if (isSupporter && winningSet.size < 3) {
      details.push(
        translate(
          message.guildID,
          "strings:SLOTS_DOUBLE_REWARD",
          { amount: finalAmount * 2 },
        ),
      );
    }
    details.push(row1.join(" | "), row2.join(" | "), row3.join(" | "));

    // TODO: Missions
    // if (message.member && message.guildID) Gamer.helpers.levels.completeMission(message.member, 'slots', message.guildID)
    sendResponse(message, details.join("\n"));
  },
});
