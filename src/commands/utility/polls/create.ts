import { addReactions, botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import {
  createSubcommand,
  sendAlertResponse,
  sendEmbed,
  sendResponse,
  stringToMilliseconds,
} from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("polls", {
  name: "create",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  guildOnly: true,
  arguments: [
    { name: "channel", type: "guildtextchannel" },
    { name: "resultsChannel", type: "guildtextchannel", required: false },
    { name: "question", type: "...string" },
  ] as const,
  execute: async function (message, args) {
    const CANCEL_OPTIONS = translate(
      message.guildID,
      "strings:CANCEL_OPTIONS",
      { returnObjects: true },
    );
    const SKIP_OPTIONS = translate(
      message.guildID,
      "strings:SKIP_OPTIONS",
      { returnObjects: true },
    );

    await sendResponse(
      message,
      translate(message.guildID, "strings:POLLS_NEED_OPTION", { number: 1 }),
    );
    const options = [];

    // REQUEST OPTIONS FROM THE USER
    while (options.length < 20) {
      const option = await botCache.helpers.needMessage(
        message.author.id,
        message.channelID,
      );
      if (!option.content) return botCache.helpers.reactError(option);

      if (CANCEL_OPTIONS.includes(option.content.toLowerCase())) {
        return botCache.helpers.reactSuccess(option);
      }

      if (SKIP_OPTIONS.includes(option.content.toLowerCase())) {
        if (options.length < 2) {
          await sendAlertResponse(
            option,
            translate(
              message.guildID,
              "strings:POLLS_NEED_2_OPTIONS",
              { amount: options.length },
            ),
          );
          continue;
        }

        // User wishes to go to next step
        break;
      }

      options.push(option.content);
      if (options.length < 20) {
        await sendResponse(
          option,
          translate(
            message.guildID,
            "strings:POLLS_OPTION_ADDED",
            { current: options.length, number: options.length + 1 },
          ),
        );
      }
    }

    // REQUEST THE DURATION OF THE POLL
    let durationMilliseconds = 0;
    await sendResponse(
      message,
      translate(message.guildID, "strings:POLLS_NEED_DURATION"),
    );
    const duration = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (!duration?.content) return botCache.helpers.reactError(message);
    if (CANCEL_OPTIONS.includes(duration.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(duration);
    }
    if (!SKIP_OPTIONS.includes(duration.content.toLowerCase())) {
      const valid = stringToMilliseconds(duration.content);
      if (!valid) return botCache.helpers.reactError(duration);
      durationMilliseconds = valid;
    }

    // REQUEST THE AMOUNT OF VOTES PER USER
    let maxVotes = 1;
    await sendResponse(
      message,
      translate(message.guildID, "strings:POLLS_VOTE_COUNT"),
    );
    const voteCount = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (!voteCount?.content) return botCache.helpers.reactError(message);
    if (CANCEL_OPTIONS.includes(voteCount.content.toLowerCase())) {
      return botCache.helpers.reactSuccess(voteCount);
    }
    if (!SKIP_OPTIONS.includes(duration.content.toLowerCase())) {
      const valid = Number(voteCount.content);
      if (!valid || valid < 1) return botCache.helpers.reactError(message);
      maxVotes = valid;
    }

    // REQUEST ANY REQUIRED ROLES
    let requiredRoleIDs: string[] = [];
    await sendResponse(
      message,
      translate(message.guildID, "strings:POLLS_REQUIRE_ROLES"),
    );
    const rolesRequired = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (!rolesRequired?.content) return botCache.helpers.reactError(message);
    if (
      CANCEL_OPTIONS.includes(rolesRequired.content.toLowerCase())
    ) {
      return botCache.helpers.reactSuccess(rolesRequired);
    }
    if (!SKIP_OPTIONS.includes(duration.content.toLowerCase())) {
      requiredRoleIDs = rolesRequired.mentionRoleIDs;
    }

    // First send the message to the channel
    const embed = new Embed()
      .setTitle(args.question)
      .setFooter(
        translate(message.guildID, "strings:POLL_ID", { id: message.id }),
      )
      .setDescription(
        options.map((opt, index) =>
          `${botCache.constants.emojis.letters[index]} ${opt}`
        ).join("\n"),
      );

    const pollMessage = await sendEmbed(args.channel.id, embed)?.catch(
      console.log,
    );
    if (!pollMessage) return botCache.helpers.reactError(message);

    await addReactions(
      pollMessage.channelID,
      pollMessage.id,
      botCache.constants.emojis.letters.slice(0, options.length - 1),
    ).catch(console.log);

    // Create the poll in the db
    await db.polls.create(pollMessage.id, {
      id: pollMessage.id,
      userID: message.author.id,
      guildID: message.guildID,
      channelID: pollMessage.channelID,
      question: args.question,
      options: options,
      endsAt: durationMilliseconds ? Date.now() + durationMilliseconds : 0,
      maxVotes: maxVotes,
      allowedRoleIDs: requiredRoleIDs,
      resultsChannelID: args.resultsChannel?.id || args.channel.id,
      votes: [],
    });

    return sendResponse(
      message,
      translate(
        message.guildID,
        "strings:POLLS_CREATED",
        { channel: `<#${args.channel.id}>` },
      ),
    );
  },
});
