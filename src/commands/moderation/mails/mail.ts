import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "mail",
  aliases: ["mails", "m"],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "content", type: "...string", required: false },
  ] as const,
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  execute: async (message, args, guild) => {
    if (!args.content && !message.attachments.length) return botCache.helpers.reactError(message);
    if (!args.content) args.content = "";

    if (!message.guildID) {
      return botCache.helpers.mailHandleDM(message, args.content);
    }

    const settings = await botCache.helpers.upsertGuild(message.guildID);
    if (!settings?.mailsEnabled) return botCache.helpers.reactError(message);

    if (!botCache.helpers.isModOrAdmin(message, settings)) {
      return botCache.helpers.mailHandleSupportChannel(message, args.content);
    }

    const mail = await db.mails.get(message.channelID);
    if (!mail) {
      return botCache.helpers.mailHandleSupportChannel(message, args.content);
    }

    // @ts-ignore
    return botCache.commands.get("mail")?.subcommands?.get("reply")?.execute?.(message, args, guild);
  },
});
