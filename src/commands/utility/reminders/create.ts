import { avatarURL } from "../../../../deps.ts";
import {
  createSubcommand,
  sendEmbed,
  humanizeMilliseconds,
} from "../../../utils/helpers.ts";
import { remindersDatabase } from "../../../database/schemas/reminders.ts";
import { botCache } from "../../../../mod.ts";
import { Embed } from "../../../utils/Embed.ts";

createSubcommand("remind", {
  name: "create",
  cooldown: {
    seconds: 120,
    allowedUses: 2,
  },
  guildOnly: true,
  arguments: [
    { name: "start", type: "duration" },
    { name: "interval", type: "duration", required: false },
    { name: "content", type: "...string" },
  ],
  execute: async (message, args) => {
    remindersDatabase.insertOne({
      reminderID: message.id,
      guildID: message.guildID,
      channelID: message.channelID,
      memberID: message.author.id,
      recurring: true,
      content: args.content,
      timestamp: message.timestamp + args.start,
      interval: args.interval,
    });

    botCache.helpers.reactSuccess(message);
  },
});

interface RemindCreateArgs {
  start: number;
  interval?: number;
  content: string;
}
