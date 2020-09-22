import { botCache } from "../../../../mod.ts";
import type { mailsDatabase } from "../../../database/schemas/mails.ts";

botCache.commands.set("mail", {
  name: "mail",
  aliases: ["mails", "m"],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "content", type: "...string" },
  ],
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  execute: async (message, args: MailArgs, guild) => {
    if (!message.guildID) {
      return botCache.helpers.mailHandleDM(message, args.content);
    }

    const settings = await botCache.helpers.upsertGuild(message.guildID);
    if (!settings?.mailsEnabled) return botCache.helpers.reactError(message);

    const member = message.member();
    if (!member) return botCache.helpers.reactError(message);

    if (!botCache.helpers.isModOrAdmin(message, settings)) {
      console.log(2);
      return botCache.helpers.mailHandleSupportChannel(message, args.content);
    }

    const mail = await mailsDatabase.findOne({ channelID: message.channelID });
    if (!mail) {
      return botCache.helpers.mailHandleSupportChannel(message, args.content);
    }

    console.log(3, args);
    botCache.commands.get("mail")
      ?.subcommands?.get("reply")
      ?.execute?.(message, args, guild);
  },
});

interface MailArgs {
  content: string;
}
