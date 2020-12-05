import { guildIconURL } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/handlers/guild.ts";
import { rawAvatarURL } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/handlers/member.ts";
import { addReaction } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/handlers/message.ts";
import { botCache, getMessage, Role, sendMessage } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import {
  createSubcommand,
  humanizeMilliseconds,
  sendEmbed,
  stringToMilliseconds,
} from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";
import { cache } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/utils/cache.ts";

createSubcommand("giveaway", {
  name: "create",
  aliases: ["c"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
    { name: "time", type: "duration", required: false },
    { name: "winners", type: "number", required: false },
    { name: "title", type: "string", required: false },
  ] as const,
  execute: async function (message, args, guild) {
    if (!guild) return;

    const CANCEL_OPTIONS = translate(
      message.guildID,
      "strings:CANCEL_OPTIONS",
      { returnObjects: true },
    );

    function parseRole(id: string) {
      return botCache.arguments.get("role")?.execute(
        { name: "role" },
        [id],
        message,
        { name: "gc" },
      ) as Role | undefined;
    }

    // If args were provided they are opting for a simple solution
    if (args.channel && args.title) {
      const embed = new Embed()
        .setAuthor(args.title, guildIconURL(guild))
        .setDescription(
          [
            translate(
              message.guildID,
              "strings:GIVEAWAY_CREATE_REACT_WITH",
              { emoji: botCache.constants.emojis.giveaway },
            ),
            translate(
              message.guildID,
              "strings:GIVEAWAY_CREATE_AMOUNT_WINNERS",
              { amount: args.winners },
            ),
          ].join("\n"),
        )
        .setThumbnail(
          rawAvatarURL(
            message.author.id,
            message.author.discriminator,
            message.author.avatar,
          ),
        )
        .setFooter(
          translate(message.guildID, "strings:GIVEAWAY_CREATE_ENDS_IN"),
        )
        .setTimestamp(
          Date.now() + (args.time || botCache.constants.milliseconds.WEEK),
        );

      const giveawayMessage = await sendEmbed(
        args.channel.id,
        embed,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_SIMPLE_CONTENT"),
      )?.catch(console.log);
      if (!giveawayMessage) return;

      addReaction(
        message.channelID,
        giveawayMessage.id,
        botCache.constants.emojis.giveaway,
      ).catch(console.log);

      db.giveaways.create(giveawayMessage.id, {
        guildID: message.guildID,
        memberID: message.author.id,
        costToJoin: 100,
        requiredRoleIDsToJoin: [],
        participants: [],
        pickedParticipants: [],
        createdAt: Date.now(),
        duration: args.time || botCache.constants.milliseconds.WEEK,
        amountOfWinners: args.winners || 1,
        allowDuplicates: false,
        duplicateCooldown: 0,
        emoji: botCache.constants.emojis.giveaway,
        pickWinners: true,
        pickInterval: 0,
        notificationsChannelID: args.channel.id,
        delayTillStart: 0,
        hasStarted: true,
        hasEnded: false,
        allowCommandEntry: true,
        allowReactionEntry: true,
        simple: true,
        setRoleIDs: [],
      });

      return sendMessage(
        message.channelID,
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_CREATED_SIMPLE",
          { id: message.id, channel: args.channel.mention },
        ),
      );
    }

    if (!botCache.vipGuildIDs.has(message.guildID)) {
      return botCache.helpers.reactError(message, true);
    }

    // The channel id where this giveaway will occur.
    sendMessage(
      message.channelID,
      translate(
        message.guildID,
        "strings:GIVEAWAY_CREATE_NEED_GIVEAWAY_CHANNEL",
      ),
    ).catch(console.error).catch(console.error);
    const channelResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(channelResponse);
    }

    const [channel] = channelResponse.mentionChannels;
    if (!channel) return botCache.helpers.reactError(message);

    // The message id attached to this giveaway. Will be "" if the only way to enter is command based.
    sendMessage(
      message.channelID,
      translate(
        message.guildID,
        "strings:GIVEAWAY_CREATE_NEED_GIVEAWAY_MESSAGE_ID",
      ),
    ).catch(console.error).catch(console.error);
    const messageResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(messageResponse);
    }

    const requestedMessage = messageResponse.content !== "skip"
      ? cache.messages.get(messageResponse.content) ||
        (await getMessage(channel.id, messageResponse.content).catch(() =>
          undefined
        ))
      : undefined;
    if (messageResponse.content !== "skip" && !requestedMessage) {
      sendMessage(
        message.channelID,
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_INVALID_MESSAGE",
          { channel: `<#${channel.id}>` },
        ),
      ).catch(console.error).catch(console.error);
    }
    if (messageResponse.content === "skip") {
      sendMessage(
        message.channelID,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_DEFAULT_MESSAGE"),
      ).catch(console.error).catch(console.error);
    }

    // The amount of gamer coins needed to enter.

    sendMessage(
      message.channelID,
      translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_COST_TO_JOIN"),
    ).catch(console.error).catch(console.error);
    const costResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(costResponse);
    }

    const costToJoin = Number(costResponse.content);
    if (costResponse.content === "skip") {
      sendMessage(
        message.channelID,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_DEFAULT_COST"),
      );
    }

    // The role ids that are required to join. User must have atleast 1.

    sendMessage(
      message.channelID,
      translate(
        message.guildID,
        "strings:GIVEAWAY_CREATE_NEED_REQUIRED_ROLES_TO_JOIN",
      ),
    ).catch(console.error).catch(console.error);
    const requiredRolesResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(requiredRolesResponse);
    }

    if (requiredRolesResponse.content === "skip") {
      sendMessage(
        message.channelID,
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_DEFAULT_REQUIRED_ROLES",
        ),
      ).catch(console.error).catch(console.error);
    }
    const requiredRoles = requiredRolesResponse.content.split(" ").map((id) =>
      parseRole(id)?.id
    );

    // How long is this giveaway going to last for.

    sendMessage(
      message.channelID,
      translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_DURATION"),
    ).catch(console.error).catch(console.error);
    const durationResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(durationResponse);
    }

    const duration = stringToMilliseconds(durationResponse.content);
    if (!duration) {
      sendMessage(
        message.channelID,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_DEFAULT_DURATION"),
      );
    }

    // The amount of winners for this giveaway

    sendMessage(
      message.channelID,
      translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_AMOUNT_WINNERS"),
    ).catch(console.error);
    const amountResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(amountResponse);
    }

    const amount = Number(amountResponse.content);
    if (amountResponse.content === "skip" || !amount) {
      sendMessage(
        message.channelID,
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_INVALID_AMOUNT_WINNERS",
        ),
      ).catch(console.error);
    }

    // Whether users are allowed to enter the giveaway multiple times.

    sendMessage(
      message.channelID,
      translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_DUPLICATES"),
    ).catch(console.error);
    const duplicatesResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(duplicatesResponse);
    }

    const YES_OPTIONS = translate(
      message.guildID,
      "strings:YES_OPTIONS",
      { returnObjects: true },
    );
    const allowDuplicates = YES_OPTIONS.includes(duplicatesResponse.content);

    // How long does a user need to wait to enter the giveaway again. For example, one time per day.
    let duplicateCooldown = 0;

    if (allowDuplicates) {
      sendMessage(
        message.channelID,
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_NEED_DUPLICATE_DURATION",
        ),
      ).catch(console.error);
      const duplicateDurationResponse = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID,
      );
      if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
        return botCache.helpers.reactSuccess(duplicateDurationResponse);
      }

      duplicateCooldown = stringToMilliseconds(
        duplicateDurationResponse.content,
      )!;
      if (!duplicateCooldown) {
        sendMessage(
          message.channelID,
          translate(
            message.guildID,
            "strings:GIVEAWAY_CREATE_DEFAULT_DUPLICATE_DURATION",
          ),
        ).catch(console.error);
      }
    }

    let emoji = botCache.constants.emojis.giveaway;

    if (messageResponse.content !== "skip") {
      sendMessage(
        message.channelID,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_EMOJI"),
      ).catch(console.error);
      const emojiResponse = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID,
      );
      if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
        return botCache.helpers.reactSuccess(emojiResponse);
      }

      if (emojiResponse.content === "skip") {
        sendMessage(
          message.channelID,
          translate(
            message.guildID,
            "strings:GIVEAWAY_CREATE_DEFAULT_EMOJI",
            { emoji },
          ),
        );
      } else emoji = emojiResponse.content;
    }

    // Whether users picked will be the winners or the losers.
    sendMessage(
      message.channelID,
      translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_PICK_WINNERS"),
    ).catch(console.error);
    const pickWinnersResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(pickWinnersResponse);
    }

    const pickWinners = YES_OPTIONS.includes(pickWinnersResponse.content);

    // The amount of time to wait before picking the next user.
    sendMessage(
      message.channelID,
      translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_PICK_INTERVAL"),
    ).catch(console.error);
    const pickIntervalResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(pickIntervalResponse);
    }

    const pickInterval = stringToMilliseconds(pickIntervalResponse.content);
    if (!pickInterval) {
      sendMessage(
        message.channelID,
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_DEFAULT_PICK_INTERVAL",
        ),
      );
    }

    // The channel id where messages will be sent when reaction based like X has joined the giveaway.
    sendMessage(
      message.channelID,
      translate(
        message.guildID,
        "strings:GIVEAWAY_CREATE_NEED_NOTIFICATIONS_CHANNEL",
      ),
    ).catch(console.error);
    const notificationsChannelResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(notificationsChannelResponse);
    }

    const [notificationsChannel] = notificationsChannelResponse.mentionChannels;
    if (!notificationsChannel) {
      return sendMessage(
        message.channelID,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_INVALID_CHANNEL"),
      );
    }

    // The amount of milliseconds to wait before starting this giveaway.
    sendMessage(
      message.channelID,
      translate(
        message.guildID,
        "strings:GIVEAWAY_CREATE_NEED_DELAY_TILL_START",
      ),
    ).catch(console.error);
    const delayTillStartResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(delayTillStartResponse);
    }

    const delayTillStart = stringToMilliseconds(delayTillStartResponse.content);
    if (!duplicateCooldown) {
      sendMessage(
        message.channelID,
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_DEFAULT_DELAY_TILL_START",
        ),
      );
    }

    // Whether the giveaway allows entry using commands.

    sendMessage(
      message.channelID,
      translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_ALLOW_COMMANDS"),
    ).catch(console.error);
    const allowCommandsResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(allowCommandsResponse);
    }

    let allowCommandEntry = YES_OPTIONS.includes(allowCommandsResponse.content);
    let setRoleIDs: string[] = [];

    if (allowCommandEntry) {
      // The role ids that are required to join when using the command. This role will be given to the user.

      sendMessage(
        message.channelID,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_SET_ROLES"),
      ).catch(console.error);
      const setRolesResponse = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID,
      );
      if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
        return botCache.helpers.reactSuccess(setRolesResponse);
      }

      setRoleIDs = setRolesResponse.content.split(" ").map((id) =>
        parseRole(id)?.id || ""
      );
    }

    let allowReactionEntry = false;
    if (requestedMessage) {
      // Whether the giveaway allows entry using reaction entries.
      sendMessage(
        message.channelID,
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_NEED_ALLOW_REACTIONS",
        ),
      ).catch(console.error);
      const allowReactionsResponse = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID,
      );
      if (CANCEL_OPTIONS.includes(channelResponse.content.toLowerCase())) {
        return botCache.helpers.reactSuccess(allowReactionsResponse);
      }

      allowReactionEntry = YES_OPTIONS.includes(allowReactionsResponse.content);
    }

    if (!allowCommandEntry && !allowReactionEntry) {
      return sendMessage(
        message.channelID,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_NO_ENTRY_ALLOWED"),
      );
    }

    db.giveaways.create(requestedMessage?.id || message.id, {
      guildID: message.guildID,
      memberID: message.author.id,
      channelID: channel.id,
      costToJoin: costToJoin >= 0 ? costToJoin : 100,
      requiredRoleIDsToJoin: (requiredRoles?.filter((r) =>
        r
      ) || []) as string[],
      participants: [],
      pickedParticipants: [],
      createdAt: Date.now(),
      duration: duration || botCache.constants.milliseconds.WEEK,
      amountOfWinners: amount || 1,
      allowDuplicates,
      duplicateCooldown: duplicateCooldown ||
        botCache.constants.milliseconds.DAY,
      emoji: emoji || botCache.constants.emojis.giveaway,
      pickWinners,
      pickInterval: pickInterval || 0,
      notificationsChannelID: notificationsChannel.id,
      delayTillStart: delayTillStart || 0,
      hasStarted: !Boolean(delayTillStart),
      hasEnded: false,
      allowCommandEntry,
      allowReactionEntry,
      simple: false,
      setRoleIDs: (setRoleIDs?.filter((r) => r) || []) as string[],
    });

    if (requestedMessage) {
      addReaction(requestedMessage.channelID, requestedMessage.id, emoji).catch(
        console.log,
      );
    }

    return sendMessage(
      message.channelID,
      translate(message.guildID, "strings:GIVEAWAY_CREATE_CREATED", {
        id: message.id,
        channel: `<#${channel.id}>`,
        time: delayTillStart ? humanizeMilliseconds(delayTillStart) : "0s",
      }),
    );
  },
});
