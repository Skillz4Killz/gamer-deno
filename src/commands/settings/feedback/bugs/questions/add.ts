import { botCache } from "../../../../../../deps.ts";
import { PermissionLevels } from "../../../../../types/commands.ts";
import {
  createSubcommand,
  sendResponse,
} from "../../../../../utils/helpers.ts";
import { addReactions, deleteMessages } from "../../../../../../deps.ts";
import { db } from "../../../../../database/database.ts";

createSubcommand("settings-feedback-bugs-questions", {
  name: "add",
  aliases: ["a"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  execute: async function (message) {
    const responseQuestion = await sendResponse(
      message,
      [
        "How would you like users to respond to this question?",
        "",
        "1. Message",
        "2. Reaction",
      ].join("\n"),
    );
    if (!responseQuestion) return;

    await addReactions(
      message.channelID,
      responseQuestion.id,
      botCache.constants.emojis.numbers.slice(0, 2),
    );
    const typeResponse = await botCache.helpers.needReaction(
      message.author.id,
      responseQuestion.id,
    ).catch(console.log);
    const messageIDs = [responseQuestion.id];
    if (!typeResponse) {
      await deleteMessages(message.channelID, messageIDs).catch(console.log);
      return botCache.helpers.reactError(message);
    }

    await sendResponse(
      message,
      "Please type the exact question you would like to ask the users now. For example: `What is your in game name?`",
    );
    const textResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (!textResponse) {
      await deleteMessages(message.channelID, messageIDs).catch(console.log);
      return botCache.helpers.reactError(message);
    }

    await sendResponse(
      message,
      "Please type the label name you would like to use for this question. For example: `In-Game Name:`",
    );
    const nameResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (!nameResponse) {
      await deleteMessages(message.channelID, messageIDs).catch(console.log);
      return botCache.helpers.reactError(message);
    }

    // The user wanted to choose message type
    if (typeResponse === botCache.constants.emojis.numbers[0]) {
      const subtypeQuestion = await sendResponse(
        message,
        [
          "What type of response would you like for the user to provide?",
          "",
          "1. 1 Word text",
          "2. Multiple words",
          "3. A number",
        ].join("\n"),
      );
      if (!subtypeQuestion) return;

      await addReactions(
        message.channelID,
        subtypeQuestion.id,
        botCache.constants.emojis.numbers.slice(0, 3),
      );
      const subtypeResponse = await botCache.helpers.needReaction(
        message.author.id,
        subtypeQuestion.id,
      ).catch(console.log);
      if (!subtypeResponse) {
        await deleteMessages(message.channelID, messageIDs).catch(
          console.log,
        );
        return botCache.helpers.reactError(message);
      }
      const subtype = subtypeResponse === botCache.constants.emojis.numbers[0]
        ? "string"
        : subtypeResponse === botCache.constants.emojis.numbers[1]
        ? "...string"
        : "number";

      // Update the database
      const settings = await db.guilds.get(message.guildID);
      if (!settings) {
        await deleteMessages(message.channelID, messageIDs).catch(
          console.log,
        );
        return botCache.helpers.reactError(message);
      }

      await db.guilds.update(message.guildID, {
        bugsQuestions: [
          ...settings.bugsQuestions,
          {
            type: "message",
            name: nameResponse.content,
            text: textResponse.content,
            subtype,
          },
        ],
      });
      await deleteMessages(message.channelID, messageIDs).catch(console.log);

      return botCache.helpers.reactSuccess(message);
    }

    // Reaction based
    await sendResponse(
      message,
      "Please type the separate options the user can select from. Separate each option using `|`. For example: `NA | SA | EU | SA | EA | CN | SEA`",
    );

    const optionsResponse = await botCache.helpers.needMessage(
      message.author.id,
      message.channelID,
    );
    if (!optionsResponse) {
      await deleteMessages(message.channelID, messageIDs).catch(console.log);
      return botCache.helpers.reactError(message);
    }

    // Update the database
    const settings = await db.guilds.get(message.guildID);
    if (!settings) {
      await deleteMessages(message.channelID, messageIDs).catch(console.log);
      return botCache.helpers.reactError(message);
    }

    await db.guilds.update(message.guildID, {
      bugsQuestions: [
        ...settings.bugsQuestions,
        {
          name: nameResponse.content,
          text: textResponse.content,
          type: "reaction",
          options: optionsResponse.content.split(" | "),
        },
      ],
    });

    await deleteMessages(message.channelID, messageIDs).catch(console.log);
    return botCache.helpers.reactSuccess(message);
  },
});
