import { botCache, sendMessage } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand, createSubcommand, sendResponse } from "../../utils/helpers.ts";

const alertCommands = [
  { name: "reddit", aliases: [], vipServerOnly: false, db: db.reddit },
  { name: "manga", aliases: [], vipServerOnly: true, db: db.manga },
  { name: "twitch", aliases: [], vipServerOnly: false, db: db.twitch },
  { name: "youtube", aliases: [], vipServerOnly: false, db: db.youtube },
  { name: "twitter", aliases: [], vipServerOnly: true, db: db.twitter },
  { name: "instagram", aliases: [], vipServerOnly: true, db: db.instagram },
  { name: "facebook", aliases: [], vipServerOnly: true, db: db.facebook },
];

alertCommands.forEach((command) => {
  // Creates the base command for each command
  createCommand({
    name: command.name,
    guildOnly: true,
    arguments: [{ name: "subcommand", type: "subcommand" }],
  });

  // Create the list command for each command
  createSubcommand(command.name, {
    name: `list`,
    aliases: ["l"],
    guildOnly: true,
    permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
    botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
    execute: async function (message) {
      // Fetch the subsc for this guild id
      const subs = await command.db.findMany(
        { guildID: message.guildID },
        true,
      );
      // If no subs were found error out.
      if (!subs.length) return botCache.helpers.reactError(message);
      // Map all the subs on this guild into chunks of 2000 character strings responses
      const responses = botCache.helpers.chunkStrings(
        subs.map((sub) => `${sub.id} ${sub.guildID}`),
      );

      for (const response of responses) {
        sendMessage(
          message.channelID,
          {
            content: response,
            replyMessageID: message.id,
            mentions: { parse: [], repliedUser: true },
          },
        );
      }
    },
  });

  // Create the subscribe command for each command
  createSubcommand(command.name, {
    name: `subscribe`,
    aliases: ["sub"],
    guildOnly: true,
    vipServerOnly: command.vipServerOnly,
    permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
    botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_WEBHOOKS"],
    arguments: [
      { name: "username", type: "string" },
      { name: "filter", type: "...string", lowercase: true, defaultValue: "" },
    ],
    execute: async function (message, args: SubscribeArgs) {
      // Fetch this username from subscriptions specifically for reddit
      const sub = await command.db.get(args.username);

      // Ask the user to provide the custom alert message
      sendResponse(
        message,
        "Please type the message you would like to send now.",
      );
      // TODO: Should this be a VIP feature???
      const alertMessage = await botCache.helpers.needMessage(
        message.channelID,
        message.author.id,
      );
      if (!alertMessage?.content.length) {
        return botCache.helpers.reactError(message);
      }

      // If it does not exist create a new subscription for the user
      if (!sub) {
        // TODO: fix the webhook stuff here
        command.db.update(
          args.username,
          {
            subscriptions: [
              {
                guildID: message.guildID,
                channelID: message.channelID,
                filter: args.filter,
                text: alertMessage.content,
                webhooktoken: "IDK",
                webhookID: "IDK",
              },
            ],
          },
        );
        return botCache.helpers.reactSuccess(message);
      }

      // The user already has a subscription created for reddit we only need to add a sub to it
      const subscription = sub.subscriptions.find((subscription) =>
        subscription.channelID === message.channelID
      );
      if (subscription) return botCache.helpers.reactError(message);

      // Add new subscription to the existing ones
      command.db.update(
        args.username,
        {
          subscriptions: [
            ...sub.subscriptions,
            {
              guildID: message.guildID,
              channelID: message.channelID,
              filter: args.filter,
              text: alertMessage.content,
              webhooktoken: "IDK",
              webhookID: "IDK",
            },
          ],
        },
      );
      return botCache.helpers.reactSuccess(message);
    },
  });

  // Create the UNSUBSCRIBE command for each command
  createSubcommand(command.name, {
    name: `unsubscribe`,
    aliases: ["unsub"],
    guildOnly: true,
    // Anyone should be able to unsub
    // Why dd 

    vipServerOnly: false,
    permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
    botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
    arguments: [
      { name: "username", type: "string" },
    ],
    execute: async function (message, args: UnsubscribeArgs) {
      // Fetch this username from subscriptions specifically for reddit
      const sub = await command.db.get(args.username);
      // No sub was found for this username, can't unsub if it never existed
      if (!sub) return botCache.helpers.reactError(message);

      const leftoverSubs = sub.subscriptions.filter((subscription) =>
        subscription.channelID !== message.channelID
      );

      // If some channel is still listening
      if (leftoverSubs.length > 1) {
        command.db.update(args.username, { subscriptions: leftoverSubs });
      } else {
        // No one is left listening so just remove from database
        command.db.delete(args.username);
      }
    },
  });
});

interface SubscribeArgs {
  username: string;
  filter: string;
}

interface UnsubscribeArgs {
  username: string;
}
