import { deleteMessage } from "https://raw.githubusercontent.com/Skillz4Killz/Discordeno/next/src/handlers/message.ts";
import {
  addReactions,
  botCache,
  botID,
  createGuildChannel,
  editMessage,
  followChannel,
  OverwriteType,
  sendMessage,
} from "../../../../deps.ts";
import { parsePrefix } from "../../../monitors/commandHandler.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createCommand, sendResponse } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

const setupEmojis = {
  updating: "<a:updating:786791988061143060>",
  loading: "<a:loading:786791987256492032>",
};

function createProgressBar(progress: number, loading: number, updating = true) {
  const emojis = [setupEmojis.updating];
  if (!updating) emojis.shift();

  for (let i = 0; i < progress; i++) {
    emojis.push(botCache.constants.emojis.colors.limegreen);
  }
  for (let i = 0; i < loading; i++) {
    emojis.push(setupEmojis.loading);
  }
  emojis.push(` ${Math.floor((progress / progress + loading) * 100)}%`);
  return emojis.join("");
}

createCommand({
  name: "setup",
  botServerPermissions: ["ADMINISTRATOR"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
  execute: async function (message, args, guild) {
    if (!guild) return;

    const mention = `<@!${message.author.id}>`;

    sendResponse(
      message,
      translate(message.guildID, "commands/setup:PREPARING"),
    );

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
          ],
          deny: [],
          type: OverwriteType.MEMBER,
        },
      ],
    });

    // Thank the user for using Gamer! And get them into the setup channel
    await sendMessage(
      setupChannel.id,
      translate(
        message.guildID,
        "commands/setup:BEGIN",
        { mention },
      ),
    );

    const loading = await sendMessage(
      setupChannel.id,
      createProgressBar(1, 15),
    );

    // Step 1: Gamer news subscription
    const gamerNewsChannel = await createGuildChannel(guild, "gamer-updates");
    followChannel("650349614104576021", gamerNewsChannel.id).then(() => {});
    await editMessage(loading, createProgressBar(2, 15));

    // Step 2: TODO Feature
    await botCache.commands.get("todo")
      ?.subcommands?.get("setup")
      ?.execute?.(message, {}, guild);
    await editMessage(loading, createProgressBar(3, 15));

    // Step 3: Counting Game
    await botCache.commands.get("counting")?.subcommands?.get("setup")
      ?.execute?.(message, {}, guild);
    await editMessage(loading, createProgressBar(4, 15));

    // Step 4: Idle Game
    const idleChannel = await createGuildChannel(guild, "idle-game");
    sendMessage(
      idleChannel.id,
      `${mention}, **${
        parsePrefix(message.guildID)
      }idle create** https://gamer.mod.land/docs/idle.html`,
    );
    await editMessage(loading, createProgressBar(5, 15));

    // Step 5: Confessionals
    await botCache.commands.get("mirrors")?.subcommands?.get("setup")
      ?.execute?.(message, {}, guild);
    await editMessage(loading, createProgressBar(6, 15));

    // Step 6: Mails
    await botCache.commands.get("settings")?.subcommands?.get("mails")
      ?.subcommands?.get("setup")?.execute?.(message, {}, guild);
    await editMessage(loading, createProgressBar(7, 15));

    // Step 7: Verification
    await botCache.commands.get("verify")?.subcommands?.get("setup")?.execute?.(
      message,
      {},
      guild,
    );
    await editMessage(loading, createProgressBar(8, 15));

    // Step 8: URL Filter
    await botCache.commands.get("settings")?.subcommands?.get("automod")
      ?.subcommands?.get("links")?.subcommands?.get("enable")?.execute?.(
        message,
        {},
        guild,
      );
    await editMessage(loading, createProgressBar(9, 15));

    // Step 9: Profanity Filter
    await botCache.commands.get("settings")?.subcommands?.get("automod")
      ?.subcommands?.get("profanity")?.subcommands?.get("setup")?.execute?.(
        message,
        {},
        guild,
      );
    await editMessage(loading, createProgressBar(10, 15));

    // Step 10: Capital Filter
    // @ts-ignore
    await botCache.commands.get("settings")?.subcommands?.get("automod")
      ?.subcommands?.get("capitals")?.subcommands?.get("setup")?.execute?.(
        message,
        { enabled: true },
        guild,
      );
    await editMessage(loading, createProgressBar(11, 15));

    // Step 11: Feedback
    await botCache.commands.get("settings")?.subcommands?.get("feedback")
      ?.subcommands?.get("setup")?.execute?.(message, {}, guild);
    await editMessage(loading, createProgressBar(12, 15));

    // Step 12: Welcome

    // Step 13: Server Logs

    // Step 14: Mute
    await botCache.commands.get("settings")?.subcommands?.get("mute")
      ?.execute?.(message, {}, guild);
    editMessage(loading, createProgressBar(14, 15, false));

    // Step 15: Reaction Roles Colors
    const rrChannel = await createGuildChannel(guild, "reaction-roles");
    const hold = await sendMessage(rrChannel.id, setupEmojis.loading);
    await botCache.commands.get("roles")?.subcommands?.get("reactions")
      ?.subcommands?.get("setup")?.execute?.(hold, {}, guild);
    await deleteMessage(hold).catch(console.log);
    editMessage(loading, createProgressBar(15, 15, false));
  },
});
