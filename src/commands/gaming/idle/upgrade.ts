import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { parsePrefix } from "../../../monitors/commandHandler.ts";
import {
  createSubcommand,
  humanizeMilliseconds,
  sendEmbed,
  sendResponse,
} from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("idle", {
  name: "upgrade",
  arguments: [
    {
      name: "category",
      type: "string",
      literals: [
        "friends",
        "servers",
        "channels",
        "roles",
        "perms",
        "messages",
        "invites",
        "bots",
        "hypesquads",
        "nitro",
      ],
      defaultValue: "friends",
    },
    { name: "max", type: "string", literals: ["max"], required: false },
    { name: "amount", type: "number", defaultValue: 1 },
  ] as const,
  cooldown: {
    seconds: 15,
  },
  execute: async function (message, args) {
    if (
      (args.category !== "friends") &&
      (args.category !== "servers") &&
      args.category !== "channels" &&
      args.category !== "roles" &&
      args.category !== "perms" &&
      args.category !== "messages" &&
      args.category !== "invites" &&
      args.category !== "bots" &&
      args.category !== "hypesquads" &&
      args.category !== "nitro"
    ) {
      return;
    }

    const profile = await db.idle.get(message.author.id);
    const prefix = parsePrefix(message.guildID);
    if (!profile) {
      return sendResponse(
        message,
        translate(message.guildID, "strings:IDLE_NEED_CASH", { prefix }),
      );
    }

    // These checks prevent a user from upgrading things too quickly out of order
    if ((args.category === "servers" && profile.friends < 25)) {
      return botCache.helpers.reactError(message);
    }
    if ((args.category === "channels" && profile.servers < 25)) {
      return botCache.helpers.reactError(message);
    }
    if ((args.category === "roles" && profile.channels < 25)) {
      return botCache.helpers.reactError(message);
    }
    if ((args.category === "perms" && profile.roles < 25)) {
      return botCache.helpers.reactError(message);
    }
    if ((args.category === "messages" && profile.perms < 25)) {
      return botCache.helpers.reactError(message);
    }
    if ((args.category === "invites" && profile.messages < 25)) {
      return botCache.helpers.reactError(message);
    }
    if ((args.category === "bots" && profile.invites < 25)) {
      return botCache.helpers.reactError(message);
    }
    if ((args.category === "hypesquads" && profile.bots < 25)) {
      return botCache.helpers.reactError(message);
    }
    if ((args.category === "nitro" && profile.hypesquads < 25)) {
      return botCache.helpers.reactError(message);
    }

    // First we update this users currency since the last time they were active
    const results = botCache.constants.idle.engine.process(profile);
    profile.currency = (BigInt(profile.currency) + results.currency).toString();
    profile.lastUpdatedAt = results.lastUpdatedAt;
    if (!profile.guildIDs.includes(message.guildID)) {
      profile.guildIDs.push(message.guildID);
    }

    let amount = Number(args.amount) || 1;
    // Prevent abuse of someone causing millions of loops
    if (amount > 10) amount = 10;

    let totalCost = BigInt(0);
    let title = "";
    let finalLevel = 0;

    if (
      args.max &&
      (botCache.vipGuildIDs.has(message.guildID) ||
        botCache.vipUserIDs.has(message.author.id))
    ) {
      let count = 1;
      while (true) {
        // Check the cost of this item
        const cost = BigInt(
          Math.floor(
            botCache.constants.idle.engine.calculateUpgradeCost(
              botCache.constants.idle.constants[args.category].baseCost,
              profile[args.category] + count,
            ),
          ),
        );
        profile[args.category] = Number(profile[args.category]) + 1;

        const upgrade = botCache.constants.idle.constants[args.category]
          .upgrades.get(profile[args.category]);
        const response = upgrade ? upgrade.response : "";
        title = upgrade
          ? upgrade.title
          : botCache.constants.idle.engine.currentTitle(
            args.category,
            profile[args.category],
          );

        // Check if the user can't afford this.
        if (cost > BigInt(profile.currency)) {
          const timeUntilCanAfford = Number(
            botCache.constants.idle.engine
              .calculateMillisecondsTillBuyable(
                BigInt(profile.currency),
                cost,
                botCache.constants.idle.engine.calculateTotalProfit(profile),
              )
              .toString(),
          );

          if (!args.max) {
            sendResponse(
              message,
              translate(
                message.guildID,
                "strings:IDLE_MORE_CASH",
                {
                  time: humanizeMilliseconds(timeUntilCanAfford),
                  cost,
                  currency: profile.currency,
                },
              ),
            );
          }

          // User can't afford anymore so break the loop
          break;
        }

        finalLevel = profile[args.category] || 0;
        totalCost += cost;
        // The user can afford this so we need to make the purchase for the user
        profile.currency = (BigInt(profile.currency) - cost).toString();

        // If this level has a story message response, we should send it now
        if (response) {
          const embed = botCache.helpers.authorEmbed(message)
            .setDescription(response)
            .setImage(upgrade?.meme!);

          if (
            botCache.constants.idle.engine.isEpicUpgrade(finalLevel) && title
          ) {
            embed.setFooter(title);
          }

          sendEmbed(message.channelID, embed);

          // Break if theres a response to allow the user to read the story
          break;
        }

        count++;
      }
    } else {
      for (let i = 1; i <= amount; i++) {
        // Check the cost of this item

        const cost = BigInt(
          Math.floor(
            botCache.constants.idle.engine.calculateUpgradeCost(
              botCache.constants.idle.constants[args.category].baseCost,
              profile[args.category] + i,
            ),
          ),
        );
        profile[args.category] = Number(profile[args.category]) + 1;

        const upgrade = botCache.constants.idle.constants[args.category]
          .upgrades.get(profile[args.category]);
        const response = upgrade ? upgrade.response : "";
        title = upgrade
          ? upgrade.title
          : botCache.constants.idle.engine.currentTitle(
            args.category,
            profile[args.category],
          );

        // Check if the user can't afford this.
        if (cost > BigInt(profile.currency)) {
          const timeUntilCanAfford = Number(
            botCache.constants.idle.engine
              .calculateMillisecondsTillBuyable(
                BigInt(profile.currency),
                cost,
                botCache.constants.idle.engine.calculateTotalProfit(profile),
              )
              .toString(),
          );

          if (!args.max) {
            sendResponse(
              message,
              translate(
                message.guildID,
                "strings:IDLE_MORE_CASH",
                {
                  cost: botCache.helpers.cleanNumber(cost),
                  currency: botCache.helpers.cleanNumber(profile.currency),
                  time: humanizeMilliseconds(timeUntilCanAfford),
                },
              ),
            );
          }

          // User can't afford anymore so break the loop
          break;
        }

        finalLevel = profile[args.category];
        totalCost += cost;
        // The user can afford this so we need to make the purchase for the user
        profile.currency = (BigInt(profile.currency) - cost).toString();

        // If this level has a story message response, we should send it now
        if (response) {
          const embed = botCache.helpers.authorEmbed(message)
            .setDescription(response)
            .setImage(upgrade?.meme!);

          if (
            botCache.constants.idle.engine.isEpicUpgrade(finalLevel) && title
          ) {
            embed.setFooter(title);
          }

          sendEmbed(message.channelID, embed);

          // Break if a response too allow users to read the story
          break;
        }
      }
    }

    // If there was no level changes we quitely error out. The response will have been sent above
    if (!finalLevel) return;

    // Now that all upgrades have completed, we can save the profile
    db.idle.update(message.author.id, profile);

    const embed = botCache.helpers.authorEmbed(message)
      .setTitle(
        "Click Here To Learn How To Get Free Nitro!",
        "https://discord.com/channels/223909216866402304/781055495854620762/782364081776623636",
      )
      .setDescription([
        translate(
          message.guildID,
          "strings:IDLE_UPGRADED_1",
          {
            category: args.category,
            level: finalLevel,
            cost: botCache.helpers.cleanNumber(totalCost.toLocaleString()),
          },
        ),
        translate(
          message.guildID,
          "strings:IDLE_UPGRADED_2",
          {
            amount: botCache.helpers.cleanNumber(
              BigInt(profile.currency).toLocaleString(),
            ),
          },
        ),
        translate(
          message.guildID,
          "strings:IDLE_UPGRADED_3",
          {
            profit: botCache.helpers.cleanNumber(
              botCache.constants.idle.engine.calculateTotalProfit(profile)
                .toLocaleString(),
            ),
          },
        ),
      ].join("\n"));

    if (title) embed.setFooter(title);

    sendEmbed(message.channelID, embed);
  },
});
