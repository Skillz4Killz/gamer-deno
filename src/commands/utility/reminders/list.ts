import { avatarURL } from "../../../../deps.ts";
import type {
  createSubcommand,
  sendEmbed,
  humanizeMilliseconds,
} from "../../../utils/helpers.ts";
import type { remindersDatabase } from "../../../database/schemas/reminders.ts";
import { botCache } from "../../../../mod.ts";
import type { Embed } from "../../../utils/Embed.ts";

createSubcommand("remind", {
  name: "list",
  cooldown: {
    seconds: 30,
    allowedUses: 2,
  },
  guildOnly: true,
  execute: async (message, args, guild) => {
    const reminders = await remindersDatabase.find(
      { memberID: message.author.id },
    );
    if (!reminders.length) return botCache.helpers.reactError(message);

    const member = message.member();
    if (!member) return botCache.helpers.reactError(message);

    const embed = new Embed()
      .setAuthor(member.tag, avatarURL(member));

    for (const reminder of reminders) {
      const name = `${reminder.reminderID}: ${
        humanizeMilliseconds(reminder.timestamp - message.timestamp)
      }`;

      if (
        embed.currentTotal + name.length + reminder.content.length > 6000 ||
        embed.fields.length === 25
      ) {
        await sendEmbed(message.channelID, embed);
        embed.fields = [];
      }

      embed.addField(name, reminder.content);
    }

    return sendEmbed(message.channelID, embed);
  },
});
