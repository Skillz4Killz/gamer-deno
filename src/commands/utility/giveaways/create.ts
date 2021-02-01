import {
  addReaction,
  botCache,
  cache,
  ChannelTypes,
  getMessage,
  guildIconURL,
  Message,
  rawAvatarURL,
  Role,
  sendMessage,
} from "../../../../deps.ts";
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

function parseRole(id: string, message: Message) {
  return botCache.arguments
    .get("role")
    ?.execute({ name: "role" }, [id], message, { name: "gc" }) as
    | Role
    | undefined;
}

const DEFAULT_COST = 100;

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

    // If args were provided they are opting for a simple solution
    if (args.channel && args.title) {
      const embed = new Embed()
        .setAuthor(args.title, guildIconURL(guild))
        .setDescription(
          [
            translate(message.guildID, "strings:GIVEAWAY_CREATE_REACT_WITH", {
              emoji: botCache.constants.emojis.giveaway,
            }),
            translate(
              message.guildID,
              "strings:GIVEAWAY_CREATE_AMOUNT_WINNERS",
              { amount: args.winners || 1 }
            ),
          ].join("\n")
        )
        .setThumbnail(
          rawAvatarURL(
            message.author.id,
            message.author.discriminator,
            message.author.avatar
          )
        )
        .setFooter(
          translate(message.guildID, "strings:GIVEAWAY_CREATE_ENDS_IN")
        )
        .setTimestamp(
          Date.now() + (args.time || botCache.constants.milliseconds.WEEK)
        );

      const giveawayMessage = await sendEmbed(
        args.channel.id,
        embed,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_SIMPLE_CONTENT")
      )?.catch(console.log);
      if (!giveawayMessage) return;

      await giveawayMessage
        .addReaction(botCache.constants.emojis.giveaway)
        .catch(console.log);

      await db.giveaways.create(giveawayMessage.id, {
        id: giveawayMessage.id,
        channelID: giveawayMessage.channelID,
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
        blockedUserIDs: [],
      });

      botCache.giveawayMessageIDs.add(giveawayMessage.id);

      return message.send(
        translate(message.guildID, "strings:GIVEAWAY_CREATE_CREATED_SIMPLE", {
          id: giveawayMessage.id,
          channel: args.channel.mention,
        })
      );
    }

    if (!botCache.vipGuildIDs.has(message.guildID)) {
      return botCache.helpers.reactError(message, true);
    }

    const CANCEL_OPTIONS = translate(
      message.guildID,
      "strings:CANCEL_OPTIONS",
      { returnObjects: true }
    );

    const YES_OPTIONS = translate(message.guildID, "strings:YES_OPTIONS", {
      returnObjects: true,
    });

    const NONE = translate(message.guildID, "strings:NONE").toLowerCase();

    function isCancelled(message: Message) {
      return CANCEL_OPTIONS.includes(message.content.toLowerCase());
    }

    const SKIP_OPTIONS = translate(message.guildID, "strings:SKIP_OPTIONS", {
      returnObjects: true,
    });

    // The channel id where this giveaway will occur.
    await message
      .reply(
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_NEED_GIVEAWAY_CHANNEL"
        )
      )
      .catch(console.log);
    const channelResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );
    if (isCancelled(channelResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const channelIDOrName = channelResponse.content.startsWith("<#")
      ? channelResponse.content.substring(2, channelResponse.content.length - 1)
      : channelResponse.content.toLowerCase();

    const channel =
      cache.channels.get(channelIDOrName) ||
      cache.channels.find(
        (channel) =>
          channel.name === channelIDOrName && channel.guildID === guild.id
      );

    if (channel?.type !== ChannelTypes.GUILD_TEXT)
      return botCache.helpers.reactError(message);

    // The message id attached to this giveaway. Will be "" if the only way to enter is command based.
    await message
      .reply(
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_NEED_GIVEAWAY_MESSAGE_ID",
          { none: NONE }
        )
      )
      .catch(console.log);
    const messageResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );

    if (isCancelled(messageResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    // TODO: send message
    let requestedMessage = SKIP_OPTIONS.includes(
      messageResponse.content.toLowerCase()
    )
      ? messageResponse
      : NONE === messageResponse.content.toLowerCase()
      ? undefined
      : cache.messages.get(messageResponse.content) ||
        (await getMessage(channel.id, messageResponse.content).catch(
          () => undefined
        ));

    // The amount of gamer coins needed to enter.
    await message
      .reply(
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_NEED_COST_TO_JOIN",
          { default: DEFAULT_COST }
        )
      )
      .catch(console.log);
    const costResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );

    if (isCancelled(costResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const costToJoin =
      Number(costResponse.content) >= 0
        ? Number(costResponse.content)
        : DEFAULT_COST;

    // The role ids that are required to join. User must have at least 1.
    await message
      .reply(
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_NEED_REQUIRED_ROLES_TO_JOIN"
        )
      )
      .catch(console.log);
    const requiredRolesResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );

    if (isCancelled(requiredRolesResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const requiredRoles = SKIP_OPTIONS.includes(
      requiredRolesResponse.content.toLowerCase()
    )
      ? []
      : requiredRolesResponse.content
          .split(" ")
          .map((id) => parseRole(id, message)?.id);

    // How long is this giveaway going to last for.
    await message
      .reply(
        translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_DURATION")
      )
      .catch(console.log);
    const durationResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );

    if (isCancelled(durationResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const duration = stringToMilliseconds(durationResponse.content);
    if (!duration) {
      message
        .send(
          translate(message.guildID, "strings:GIVEAWAY_CREATE_DEFAULT_DURATION")
        )
        .catch(console.log);
    }

    // The amount of winners for this giveaway
    await message
      .reply(
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_NEED_AMOUNT_WINNERS"
        )
      )
      .catch(console.log);
    const amountResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );

    if (isCancelled(amountResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const amount = Number(amountResponse.content);
    if (SKIP_OPTIONS.includes(amountResponse.content) || !amount) {
      await amountResponse
        .reply(
          translate(
            message.guildID,
            "strings:GIVEAWAY_CREATE_INVALID_AMOUNT_WINNERS"
          )
        )
        .catch(console.log);
      return botCache.helpers.reactError(message);
    }

    // Whether users are allowed to enter the giveaway multiple times.
    await message
      .reply(
        translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_DUPLICATES")
      )
      .catch(console.log);
    const duplicatesResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );

    if (isCancelled(duplicatesResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const allowDuplicates = YES_OPTIONS.includes(duplicatesResponse.content);

    // How long does a user need to wait to enter the giveaway again. For example, one time per day.
    let duplicateCooldown = 0;

    if (allowDuplicates) {
      await duplicatesResponse
        .reply(
          translate(
            message.guildID,
            "strings:GIVEAWAY_CREATE_NEED_DUPLICATE_DURATION"
          )
        )
        .catch(console.log);
      const duplicateDurationResponse = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID
      );

      if (isCancelled(duplicateDurationResponse)) {
        return botCache.helpers.reactSuccess(message);
      }

      duplicateCooldown = stringToMilliseconds(
        duplicateDurationResponse.content
      )!;
      if (!duplicateCooldown) {
        await duplicateDurationResponse
          .reply(
            translate(
              message.guildID,
              "strings:GIVEAWAY_CREATE_DEFAULT_DUPLICATE_DURATION"
            )
          )
          .catch(console.log);
        return botCache.helpers.reactError(message);
      }
    }

    // The emoji to be used in response to the message
    let emoji = botCache.constants.emojis.giveaway;

    if (SKIP_OPTIONS.includes(messageResponse.content.toLowerCase())) {
      await message
        .reply(
          translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_EMOJI", {
            default: emoji,
          })
        )
        .catch(console.log);
      const emojiResponse = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID
      );

      if (isCancelled(emojiResponse)) {
        return botCache.helpers.reactSuccess(message);
      }

      if (!SKIP_OPTIONS.includes(emojiResponse.content.toLowerCase())) {
        emoji = emojiResponse.content;
      }
    }

    // Whether users picked will be the winners or the losers.
    await message
      .reply(
        translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_PICK_WINNERS")
      )
      .catch(console.log);
    const pickWinnersResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );

    if (isCancelled(pickWinnersResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const pickWinners = YES_OPTIONS.includes(pickWinnersResponse.content);

    // The amount of time to wait before picking the next user.
    await message
      .reply(
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_NEED_PICK_INTERVAL",
          { default: 0 }
        )
      )
      .catch(console.log);
    const pickIntervalResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );

    if (isCancelled(pickIntervalResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const pickInterval =
      stringToMilliseconds(pickIntervalResponse.content) || 0;

    // The channel id where messages will be sent when reaction based like X has joined the giveaway.
    await sendMessage(
      message.channelID,
      translate(
        message.guildID,
        "strings:GIVEAWAY_CREATE_NEED_NOTIFICATIONS_CHANNEL"
      )
    ).catch(console.log);
    const notificationsChannelResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );
    if (isCancelled(notificationsChannelResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const [
      notificationsChannel,
    ] = notificationsChannelResponse.mentionedChannels;
    if (!notificationsChannel) {
      return sendMessage(
        message.channelID,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_INVALID_CHANNEL")
      );
    }

    // The amount of milliseconds to wait before starting this giveaway.
    await sendMessage(
      message.channelID,
      translate(
        message.guildID,
        "strings:GIVEAWAY_CREATE_NEED_DELAY_TILL_START"
      )
    ).catch(console.log);
    const delayTillStartResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );
    if (isCancelled(delayTillStartResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const delayTillStart = stringToMilliseconds(delayTillStartResponse.content);
    if (!duplicateCooldown) {
      await sendMessage(
        message.channelID,
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_DEFAULT_DELAY_TILL_START"
        )
      );
    }

    // Whether the giveaway allows entry using commands.

    await sendMessage(
      message.channelID,
      translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_ALLOW_COMMANDS")
    ).catch(console.log);
    const allowCommandsResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID
    );
    if (isCancelled(allowCommandsResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    let allowCommandEntry = YES_OPTIONS.includes(allowCommandsResponse.content);
    let setRoleIDs: string[] = [];

    if (allowCommandEntry) {
      // The role ids that are required to join when using the command. This role will be given to the user.

      await sendMessage(
        message.channelID,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_SET_ROLES")
      ).catch(console.log);
      const setRolesResponse = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID
      );
      if (isCancelled(setRolesResponse)) {
        return botCache.helpers.reactSuccess(message);
      }

      setRoleIDs = setRolesResponse.content
        .split(" ")
        .map((id) => parseRole(id, message)?.id || "");
    }

    let allowReactionEntry = false;
    if (requestedMessage) {
      // Whether the giveaway allows entry using reaction entries.
      await sendMessage(
        message.channelID,
        translate(
          message.guildID,
          "strings:GIVEAWAY_CREATE_NEED_ALLOW_REACTIONS"
        )
      ).catch(console.log);
      const allowReactionsResponse = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID
      );
      if (isCancelled(allowReactionsResponse)) {
        return botCache.helpers.reactSuccess(message);
      }

      allowReactionEntry = YES_OPTIONS.includes(allowReactionsResponse.content);
    }

    if (!allowCommandEntry && !allowReactionEntry) {
      return sendMessage(
        message.channelID,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_NO_ENTRY_ALLOWED")
      );
    }

    await db.giveaways.create(requestedMessage?.id || message.id, {
      id: requestedMessage?.id || message.id,
      guildID: message.guildID,
      memberID: message.author.id,
      channelID: channel.id,
      costToJoin: costToJoin,
      requiredRoleIDsToJoin: (requiredRoles?.filter((r) => r) ||
        []) as string[],
      participants: [],
      pickedParticipants: [],
      createdAt: Date.now(),
      duration: duration || botCache.constants.milliseconds.WEEK,
      amountOfWinners: amount || 1,
      allowDuplicates,
      duplicateCooldown:
        duplicateCooldown || botCache.constants.milliseconds.DAY,
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
      blockedUserIDs: [],
    });

    if (requestedMessage) {
      await addReaction(
        requestedMessage.channelID,
        requestedMessage.id,
        emoji
      ).catch(console.log);
    }

    return sendMessage(
      message.channelID,
      translate(message.guildID, "strings:GIVEAWAY_CREATE_CREATED", {
        id: message.id,
        channel: `<#${channel.id}>`,
        time: delayTillStart ? humanizeMilliseconds(delayTillStart) : "0s",
      })
    );
  },
});
