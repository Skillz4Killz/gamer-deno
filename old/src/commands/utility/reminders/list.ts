import { botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createSubcommand, humanizeMilliseconds } from "../../../utils/helpers.ts";

createSubcommand("remind", {
  name: "list",
  cooldown: {
    seconds: 30,
    allowedUses: 2,
  },
  guildOnly: true,
  execute: async (message) => {
    const reminders = await db.reminders.findMany({ memberID: message.author.id }, true);
    if (!reminders.length) return botCache.helpers.reactError(message);

    const member = cache.members.get(message.author.id);
    if (!member) return botCache.helpers.reactError(message);

    const embed = new Embed().setAuthor(member.tag, member.avatarURL);

    for (const reminder of reminders) {
      const name = `${reminder.reminderID}: ${humanizeMilliseconds(reminder.timestamp - message.timestamp)}`;

      if (embed.currentTotal + name.length + reminder.content.length > 6000 || embed.fields.length === 25) {
        await message.send({ embed });
        embed.fields = [];
      }

      embed.addField(name, reminder.content);
    }

    return message.send({ embed });
  },
});
