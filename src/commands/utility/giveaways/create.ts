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
} from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand, humanizeMilliseconds, sendEmbed, stringToMilliseconds } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

function parseRole(id: string, message: Message) {
  return botCache.arguments.get("role")?.execute({ name: "role" }, [id], message, { name: "gc" }) as Role | undefined;
}

function parseTextChannel(guildID: string, message: Message) {
  const channelIDOrName = message.content.startsWith("<#")
    ? message.content.substring(2, message.content.length - 1)
    : message.content.toLowerCase();

  const channel =
    cache.channels.get(channelIDOrName) ||
    cache.channels.find((channel) => channel.name === channelIDOrName && channel.guildID === guildID);

  if (channel?.type !== ChannelTypes.GUILD_TEXT) return;

  return channel;
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
            translate(message.guildID, "strings:GIVEAWAY_CREATE_AMOUNT_WINNERS", { amount: args.winners || 1 }),
          ].join("\n")
        )
        .setThumbnail(rawAvatarURL(message.author.id, message.author.discriminator, message.author.avatar))
        .setFooter(translate(message.guildID, "strings:GIVEAWAY_CREATE_ENDS_IN"))
        .setTimestamp(Date.now() + (args.time || botCache.constants.milliseconds.WEEK));

      const giveawayMessage = await sendEmbed(
        args.channel.id,
        embed,
        translate(message.guildID, "strings:GIVEAWAY_CREATE_SIMPLE_CONTENT")
      )?.catch(console.log);
      if (!giveawayMessage) return botCache.helpers.reactError(message);

      await giveawayMessage.addReaction(botCache.constants.emojis.giveaway);

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
        IGN: false,
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

    const CANCEL_OPTIONS = translate(message.guildID, "strings:CANCEL_OPTIONS", { returnObjects: true });

    const YES_OPTIONS = translate(message.guildID, "strings:YES_OPTIONS", {
      returnObjects: true,
    });

    const NO_OPTIONS = translate(message.guildID, "strings:NO_OPTIONS", {
      returnObjects: true,
    });

    function isCancelled(message: Message) {
      return CANCEL_OPTIONS.includes(message.content.toLowerCase());
    }

    const SKIP_OPTIONS = translate(message.guildID, "strings:SKIP_OPTIONS", {
      returnObjects: true,
    });

    // The channel id where this giveaway will occur.
    await message.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_GIVEAWAY_CHANNEL")).catch(console.log);
    const channelResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(channelResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const channel = parseTextChannel(guild.id, channelResponse);
    if (!channel) return botCache.helpers.reactError(message);

    // The channel id where messages will be sent when reaction based. Like X has joined the giveaway.
    await message
      .reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_NOTIFICATIONS_CHANNEL"))
      .catch(console.log);
    const notificationsChannelResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(notificationsChannelResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const notificationsChannel = parseTextChannel(guild.id, notificationsChannelResponse);
    if (!notificationsChannel) return botCache.helpers.reactError(message);

    // The message id attached to this giveaway. Will be "" if the only way to enter is command based.
    await message
      .reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_GIVEAWAY_MESSAGE_ID"))
      .catch(console.log);
    const messageResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(messageResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    let requestedMessage = SKIP_OPTIONS.includes(messageResponse.content.toLowerCase())
      ? messageResponse
      : NO_OPTIONS.includes(messageResponse.content.toLowerCase())
      ? undefined
      : cache.messages.get(messageResponse.content) ||
        (await getMessage(channel.id, messageResponse.content).catch(() => undefined));

    // The amount of gamer coins needed to enter.
    await message
      .reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_COST_TO_JOIN", { default: DEFAULT_COST }))
      .catch(console.log);
    const costResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(costResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const costToJoin = Number(costResponse.content) >= 0 ? Number(costResponse.content) : DEFAULT_COST;

    // The role ids that are required to join. User must have at least 1.
    await message
      .reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_REQUIRED_ROLES_TO_JOIN"))
      .catch(console.log);
    const requiredRolesResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(requiredRolesResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const requiredRoles = SKIP_OPTIONS.includes(requiredRolesResponse.content.toLowerCase())
      ? []
      : requiredRolesResponse.content.split(" ").map((id) => parseRole(id, message)?.id);

    // How long is this giveaway going to last for.
    await message.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_DURATION")).catch(console.log);
    const durationResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(durationResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const duration = stringToMilliseconds(durationResponse.content);
    if (!duration) {
      message.send(translate(message.guildID, "strings:GIVEAWAY_CREATE_DEFAULT_DURATION")).catch(console.log);
    }

    // The amount of winners for this giveaway
    await message.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_AMOUNT_WINNERS"));
    const amountResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(amountResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const amount = Number(amountResponse.content);
    if ((!SKIP_OPTIONS.includes(amountResponse.content) && !amount) || amount < 0) {
      await amountResponse.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_INVALID_AMOUNT_WINNERS"));
      return botCache.helpers.reactError(message);
    }

    // Whether users are allowed to enter the giveaway multiple times.
    await message.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_DUPLICATES"));
    const duplicatesResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(duplicatesResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const allowDuplicates = YES_OPTIONS.includes(duplicatesResponse.content);

    // How long does a user need to wait to enter the giveaway again. For example, one time per day.
    let duplicateCooldown;

    if (allowDuplicates) {
      await duplicatesResponse.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_DUPLICATE_DURATION"));
      const duplicateDurationResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

      if (isCancelled(duplicateDurationResponse)) {
        return botCache.helpers.reactSuccess(message);
      }

      duplicateCooldown = stringToMilliseconds(duplicateDurationResponse.content);
      if (!duplicateCooldown || duplicateCooldown < 0) {
        await duplicateDurationResponse.reply(
          translate(message.guildID, "strings:GIVEAWAY_CREATE_DEFAULT_DUPLICATE_DURATION")
        );
        return botCache.helpers.reactError(message);
      }
    }

    // Whether users picked will be the winners or the losers.
    await message.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_PICK_WINNERS"));
    const pickWinnersResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(pickWinnersResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const pickWinners = YES_OPTIONS.includes(pickWinnersResponse.content);

    // The amount of time to wait before picking the next user.
    await message.reply(
      translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_PICK_INTERVAL", {
        default: 0,
      })
    );
    const pickIntervalResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(pickIntervalResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    let pickInterval = stringToMilliseconds(pickIntervalResponse.content) || 0;

    if (pickInterval < 0) pickInterval = 0;

    // The amount of milliseconds to wait before starting this giveaway.
    await message.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_DELAY_TILL_START"));
    const delayTillStartResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(delayTillStartResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    const delayTillStart = SKIP_OPTIONS.includes(delayTillStartResponse.content)
      ? 0
      : stringToMilliseconds(delayTillStartResponse.content);

    // Whether the giveaway allows entry using commands.
    await message.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_ALLOW_COMMANDS"));
    const allowCommandsResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

    if (isCancelled(allowCommandsResponse)) {
      return botCache.helpers.reactSuccess(message);
    }

    let allowCommandEntry = YES_OPTIONS.includes(allowCommandsResponse.content);
    let setRoleIDs: string[] = [];
    let requiredIGN = false;

    if (allowCommandEntry) {
      // The role ids that are required to join when using the command. This role will be given to the user.
      await allowCommandsResponse.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_SET_ROLES"));
      const setRolesResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

      if (isCancelled(setRolesResponse)) {
        return botCache.helpers.reactSuccess(message);
      }

      setRoleIDs = SKIP_OPTIONS.includes(setRolesResponse.content.toLowerCase())
        ? []
        : (setRolesResponse.content.split(" ").map((id) => parseRole(id, message)?.id) as []);

      await allowCommandsResponse.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_REQUIRE_IGN"));
      const requiredIGNResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

      if (isCancelled(requiredIGNResponse)) {
        return botCache.helpers.reactSuccess(message);
      }

      requiredIGN = YES_OPTIONS.includes(requiredIGNResponse.content.toLowerCase());
    }

    // Whether the giveaway allows entry using reaction entries.
    let allowReactionEntry = false;
    if (requestedMessage) {
      await message.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_ALLOW_REACTIONS"));
      const allowReactionsResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

      if (isCancelled(allowReactionsResponse)) {
        return botCache.helpers.reactSuccess(message);
      }

      allowReactionEntry = YES_OPTIONS.includes(allowReactionsResponse.content);
    }

    let emoji = "";
    if (allowReactionEntry) {
      emoji = botCache.constants.emojis.giveaway;
      // The emoji to be used in response to the message
      await message.reply(
        translate(message.guildID, "strings:GIVEAWAY_CREATE_NEED_EMOJI", {
          default: emoji,
        })
      );
      const emojiResponse = await botCache.helpers.needMessage(message.author.id, message.channelID);

      if (isCancelled(emojiResponse)) {
        return botCache.helpers.reactSuccess(message);
      }

      if (!SKIP_OPTIONS.includes(emojiResponse.content.toLowerCase())) {
        emoji = emojiResponse.content;
      }
    }

    if (!allowCommandEntry && !allowReactionEntry) {
      await message.reply(translate(message.guildID, "strings:GIVEAWAY_CREATE_NO_ENTRY_ALLOWED"));
      return botCache.helpers.reactError(message);
    }

    if (requestedMessage) {
      if (SKIP_OPTIONS.includes(requestedMessage.content.toLowerCase())) {
        const embed = new Embed()
          .setAuthor(args.title || "Giveaway!", guildIconURL(guild))
          .setDescription(
            [
              translate(message.guildID, "strings:GIVEAWAY_CREATE_REACT_WITH", {
                emoji: emoji,
              }),
              translate(message.guildID, "strings:GIVEAWAY_CREATE_AMOUNT_WINNERS", { amount: args.winners || 1 }),
            ].join("\n")
          )
          .setThumbnail(rawAvatarURL(message.author.id, message.author.discriminator, message.author.avatar))
          .setFooter(translate(message.guildID, "strings:GIVEAWAY_CREATE_ENDS_IN"))
          .setTimestamp(Date.now() + (args.time || botCache.constants.milliseconds.WEEK));

        const giveawayMessage = await sendEmbed(
          channel.id,
          embed,
          translate(message.guildID, "strings:GIVEAWAY_CREATE_SIMPLE_CONTENT")
        );
        if (!giveawayMessage) return botCache.helpers.reactError(message);

        requestedMessage = giveawayMessage;
      }

      await addReaction(requestedMessage.channelID, requestedMessage.id, emoji);
    }

    await db.giveaways.create(requestedMessage?.id || message.id, {
      id: requestedMessage?.id || message.id,
      guildID: message.guildID,
      memberID: message.author.id,
      channelID: channel.id,
      costToJoin: costToJoin,
      requiredRoleIDsToJoin: (requiredRoles?.filter((r) => r) || []) as string[],
      participants: [],
      pickedParticipants: [],
      createdAt: Date.now(),
      duration: duration || botCache.constants.milliseconds.WEEK,
      amountOfWinners: amount || 1,
      allowDuplicates,
      duplicateCooldown: duplicateCooldown || botCache.constants.milliseconds.DAY,
      emoji: emoji,
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
      IGN: requiredIGN,
    });

    botCache.giveawayMessageIDs.add(requestedMessage?.id || message.id);

    return message.reply(
      translate(message.guildID, "strings:GIVEAWAY_CREATE_CREATED_SIMPLE", {
        id: requestedMessage?.id || message.id,
        channel: `<#${channel.id}>`,
        time: delayTillStart ? humanizeMilliseconds(delayTillStart) : "0s",
      })
    );
  },
});
