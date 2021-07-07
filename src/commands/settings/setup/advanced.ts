import {
  addReactions,
  botCache,
  botID,
  createGuildChannel,
  deleteChannel,
  followChannel,
  Message,
  OverwriteType,
  sendMessage,
} from "../../../../deps.ts";
import { parsePrefix } from "../../../monitors/commandHandler.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand, sendResponse } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

async function confirmedCancel(message: Message, channelID: string) {
  await sendResponse(message, translate(message.guildID, "strings:SETUP_CANCELLED"));

  await deleteChannel(message.guildID, channelID);
}

function cancelSetup(message: Message, responseMessage: Message) {
  const CANCEL_OPTIONS = translate(message.guildID, "strings:CANCEL_OPTIONS", {
    returnObjects: true,
  });

  if (!CANCEL_OPTIONS.includes(responseMessage.content.toLowerCase())) {
    return false;
  }

  confirmedCancel(message, responseMessage.channelID);
  return true;
}

const yesEmojiID = botCache.helpers.emojiID(botCache.constants.emojis.success);
const quitEmojiID = botCache.helpers.emojiID(botCache.constants.emojis.quit);
const reactions = [
  botCache.constants.emojis.success,
  botCache.constants.emojis.failure,
  botCache.constants.emojis.quit,
];

const setupEmojis = {
  updating: "<a:updating:786791988061143060>",
  loading: "<a:loading:830724168823734274>",
};

function createProgressBar(progress: number, total: number, updating = true) {
  const emojis = [setupEmojis.updating];
  if (!updating) emojis.shift();

  for (let i = 0; i < progress; i++) {
    emojis.push(botCache.constants.emojis.colors.limegreen);
  }
  for (let i = 0; i < total - progress; i++) {
    emojis.push(`${setupEmojis.loading} `);
  }
  emojis.push(` ${Math.floor((progress / total) * 100)}%`);
  return emojis.join("");
}

createSubcommand("setup", {
  name: "advanced",
  botServerPermissions: ["ADMINISTRATOR"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
  execute: async function (message, args, guild) {
    if (!guild) return;

    const mention = `<@!${message.author.id}>`;

    await sendResponse(message, translate(message.guildID, "strings:SETUP_PREPARING"));

    // Create the setup spam channel
    const setupChannel = await createGuildChannel(guild, "gamer-setup", {
      position: 1,
      permissionOverwrites: [
        {
          id: botID,
          allow: [
            "VIEW_CHANNEL",
            "SEND_MESSAGES",
            "EMBED_LINKS",
            "ADD_REACTIONS",
            "READ_MESSAGE_HISTORY",
            "MANAGE_CHANNELS",
            "USE_EXTERNAL_EMOJIS",
          ],
          deny: [],
          type: OverwriteType.MEMBER,
        },
        {
          id: message.author.id,
          allow: [
            "VIEW_CHANNEL",
            "SEND_MESSAGES",
            "EMBED_LINKS",
            "ADD_REACTIONS",
            "READ_MESSAGE_HISTORY",
            "MANAGE_CHANNELS",
            "USE_EXTERNAL_EMOJIS",
          ],
          deny: [],
          type: OverwriteType.MEMBER,
        },
      ],
    });

    // Thank the user for using Gamer! And get them into the setup channel
    await sendMessage(setupChannel.id, translate(message.guildID, "strings:SETUP_BEGIN", { mention }));

    const loading = await sendMessage(setupChannel.id, createProgressBar(1, 15));

    // const CANCEL_OPTIONS = translate(
    //   message.guildID,
    //   "strings:CANCEL_OPTIONS",
    //   { returnObjects: true },
    // );

    // Ask first question.
    const beginMessage = await sendMessage(
      setupChannel.id,
      translate(message.guildID, "strings:SETUP_SUBSCRIBE_QUESTION", {
        mention,
      })
    );
    await addReactions(beginMessage.channelID, beginMessage.id, reactions, true);
    const subscribe = await botCache.helpers.needReaction(message.author.id, beginMessage.id);
    if (subscribe === quitEmojiID) {
      return confirmedCancel(message, setupChannel.id);
    }

    // The user wants to subscribe
    if (subscribe === yesEmojiID) {
      await sendMessage(setupChannel.id, translate(message.guildID, "strings:SETUP_NEED_CHANNEL", { mention }));
      const response = await botCache.helpers.needMessage(message.author.id, setupChannel.id);
      if (cancelSetup(message, response)) return;

      const [targetChannel] = response.mentionChannelIDs;
      // Subscribe to gamer news channels
      if (targetChannel) {
        followChannel("650349614104576021", targetChannel).then(() => {});
      }
    }

    await loading.edit(createProgressBar(2, 15));

    const simpleSteps = [
      {
        question: "strings:SETUP_TODO_SETUP",
        progress: 3,
        setup: botCache.commands.get("todo")?.subcommands?.get("setup"),
      },
      {
        question: "strings:SETUP_COUNTING_SETUP",
        progress: 4,
        setup: botCache.commands.get("counting")?.subcommands?.get("setup"),
      },
      {
        question: "strings:SETUP_CONFESSIONALS_SETUP",
        progress: 5,
        setup: botCache.commands.get("mirrors")?.subcommands?.get("setup"),
      },
      {
        question: "strings:SETUP_VERIFICATION_SETUP",
        progress: 6,
        setup: botCache.commands.get("verify")?.subcommands?.get("setup"),
      },
      {
        question: "strings:SETUP_URLFILTER_SETUP",
        progress: 7,
        setup: botCache.commands
          .get("settings")
          ?.subcommands?.get("automod")
          ?.subcommands?.get("links")
          ?.subcommands?.get("enable"),
      },
      {
        question: "strings:SETUP_PROFANITY_SETUP",
        progress: 8,
        setup: botCache.commands
          .get("settings")
          ?.subcommands?.get("automod")
          ?.subcommands?.get("profanity")
          ?.subcommands?.get("setup"),
      },
      {
        question: "strings:SETUP_CAPITALS_SETUP",
        progress: 9,
        setup: botCache.commands.get("settings")?.subcommands?.get("automod")?.subcommands?.get("capitals"),
      },
      {
        question: "strings:SETUP_FEEDBACK_SETUP",
        progress: 10,
        setup: botCache.commands.get("settings")?.subcommands?.get("feedback")?.subcommands?.get("setup"),
      },
      {
        question: "strings:SETUP_MUTE_SETUP",
        progress: 11,
        setup: botCache.commands.get("settings")?.subcommands?.get("mute"),
      },
    ];

    for (const step of simpleSteps) {
      const question = await setupChannel.send(translate(message.guildID, step.question, { mention }));
      await question.addReactions(reactions, true);
      const response = await botCache.helpers.needReaction(message.author.id, question.id);
      if (response === quitEmojiID) {
        return confirmedCancel(message, setupChannel.id);
      }

      // The user wants to setup response feature
      if (response === yesEmojiID) {
        await step.setup?.execute?.(message, {}, guild);
      }

      await loading.edit(createProgressBar(step.progress, 15));
    }

    // Step 4: Idle Game
    const idleChannel = await createGuildChannel(guild, "idle-game");
    await sendMessage(idleChannel.id, `https://gamer.mod.land/docs/idle.html`);
    await idleChannel.send(`${mention}`);
    await idleChannel.send(`**/idle create**`);
    await loading.edit(createProgressBar(12, 15));

    // Step 6: Mails
    const mail = await message.send(`Setting up the mod mails ${setupEmojis.loading} `);
    await botCache.commands
      .get("settings")
      ?.subcommands?.get("mails")
      ?.subcommands?.get("setup")
      ?.execute?.(mail, {}, guild);
    await loading.edit(createProgressBar(13, 15));

    // Step 12: Welcome

    // Step 13: Server Logs

    // Step 15: Reaction Roles Colors
    const rrChannel = await createGuildChannel(guild, "reaction-roles");
    const hold = await rrChannel.send(setupEmojis.loading);
    await botCache.commands
      .get("roles")
      ?.subcommands?.get("reactions")
      ?.subcommands?.get("setup")
      ?.execute?.(hold, {}, guild);
    await hold.delete().catch(console.log);
    loading.edit(createProgressBar(16, 16, false));
  },
});
