import {
  botCache,
  createGuildChannel,
  delay,
  deleteMessage,
  deleteMessageByID,
  editMessage,
  followChannel,
  sendMessage,
} from "../../../../deps.ts";
import { parsePrefix } from "../../../monitors/commandHandler.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createCommand, sendResponse } from "../../../utils/helpers.ts";

const setupEmojis = {
  updating: "<a:updating:786791988061143060>",
  loading: "<a:loading:786791987256492032>",
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

createCommand({
  name: "setup",
  botServerPermissions: ["ADMINISTRATOR"],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.SERVER_OWNER],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
  ] as const,
  execute: async function (message, args, guild) {
    if (!guild) return;

    const mention = `<@!${message.author.id}>`;

    const loading = await sendResponse(
      message,
      createProgressBar(1, 15),
    );
    if (!loading) return;

    // Step 1: Gamer news subscription
    const gamerNewsChannel = await createGuildChannel(guild, "gamer-updates");
    followChannel("650349614104576021", gamerNewsChannel.id).then(() => {});
    await editMessage(loading, createProgressBar(2, 15));
    await delay(2000);

    // Step 2: TODO Feature
    await botCache.commands.get("todo")
      ?.subcommands?.get("setup")
      ?.execute?.(message, {}, guild);
    await editMessage(loading, createProgressBar(3, 15));
    await delay(2000);

    // Step 3: Counting Game
    await botCache.commands.get("counting")?.subcommands?.get("setup")
      ?.execute?.(message, {}, guild);
    await editMessage(loading, createProgressBar(4, 15));
    await delay(2000);

    // Step 4: Idle Game
    const idleChannel = await createGuildChannel(guild, "idle-game");
    await sendMessage(
      idleChannel.id,
      `https://gamer.mod.land/docs/idle.html`,
    );
    await sendMessage(idleChannel.id, `${mention}`);
    await sendMessage(
      idleChannel.id,
      `**${parsePrefix(message.guildID)}idle create**`,
    );
    await editMessage(loading, createProgressBar(5, 15));
    await delay(2000);

    // Step 5: Confessionals
    await botCache.commands.get("mirrors")?.subcommands?.get("setup")
      ?.execute?.(message, {}, guild);
    await editMessage(loading, createProgressBar(6, 15));
    await delay(2000);

    // Step 6: Mails
    const mail = await sendMessage(
      message.channelID,
      `Setting up the mod mails ${setupEmojis.loading} `,
    );
    await botCache.commands.get("settings")?.subcommands?.get("mails")
      ?.subcommands?.get("setup")?.execute?.(mail, {}, guild);
    await editMessage(loading, createProgressBar(7, 15));
    await delay(2000);
    mail.delete().catch(console.log);

    // Step 7: Verification
    await botCache.commands.get("verify")?.subcommands?.get("setup")?.execute?.(
      message,
      {},
      guild,
    );
    await editMessage(loading, createProgressBar(8, 15));
    await delay(2000);

    // Step 8: URL Filter
    await botCache.commands.get("settings")?.subcommands?.get("automod")
      ?.subcommands?.get("links")?.subcommands?.get("enable")?.execute?.(
        loading,
        {},
        guild,
      );
    await editMessage(loading, createProgressBar(9, 15));
    await delay(2000);

    // Step 9: Profanity Filter
    await botCache.commands.get("settings")?.subcommands?.get("automod")
      ?.subcommands?.get("profanity")?.subcommands?.get("setup")?.execute?.(
        loading,
        {},
        guild,
      );
    await editMessage(loading, createProgressBar(10, 15));
    await delay(2000);

    // Step 10: Capital Filter
    await botCache.commands.get("settings")?.subcommands?.get("automod")
      ?.subcommands?.get("capitals")?.subcommands?.get("setup")?.execute?.(
        loading,
        // @ts-ignore
        { enabled: true },
        guild,
      );
    await editMessage(loading, createProgressBar(11, 15));
    await delay(2000);

    // Step 11: Feedback
    await botCache.commands.get("settings")?.subcommands?.get("feedback")
      ?.subcommands?.get("setup")?.execute?.(loading, {}, guild);
    await editMessage(loading, createProgressBar(12, 15));
    await delay(2000);

    // Step 12: Welcome

    // Step 13: Server Logs

    // Step 14: Mute
    await botCache.commands.get("settings")?.subcommands?.get("mute")
      ?.execute?.(loading, {}, guild);
    await editMessage(loading, createProgressBar(15, 16, false));
    await delay(2000);

    // Step 15: Reaction Roles Colors
    const rrChannel = await createGuildChannel(guild, "reaction-roles");
    const hold = await sendMessage(rrChannel.id, setupEmojis.loading);
    await botCache.commands.get("roles")?.subcommands?.get("reactions")
      ?.subcommands?.get("setup")?.execute?.(hold, {}, guild);
    await deleteMessage(hold).catch(console.log);
    editMessage(loading, createProgressBar(16, 16, false));

    await deleteMessageByID(message.channelID, loading.id, undefined, 10000);
  },
});
