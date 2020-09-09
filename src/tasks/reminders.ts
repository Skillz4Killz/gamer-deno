import { cache, avatarURL, getMember, sendMessage } from "../../deps.ts";
import { botCache } from "../../mod.ts";
import { remindersDatabase } from "../database/schemas/reminders.ts";
import { Embed } from "../utils/Embed.ts";
import { translate } from "../utils/i18next.ts";

botCache.tasks.set(`reminders`, {
  name: `reminders`,
  interval: botCache.constants.milliseconds.MINUTE,
  execute: async function () {
    const now = Date.now();
    const reminders = await remindersDatabase.find(
      { timestamp: { $lte: now } },
    );
    if (!reminders.length) return;

    reminders.forEach(async (reminder) => {
      const guild = cache.guilds.get(reminder.guildID);
      const member = guild?.members.get(reminder.memberID) ||
        await getMember(reminder.guildID, reminder.memberID).catch(() =>
          undefined
        );
      if (!member) {
        return remindersDatabase.deleteOne({ reminderID: reminder.reminderID });
      }

      const embed = new Embed()
        .setAuthor(member.tag, avatarURL(member))
        .setDescription(reminder.content)
        .setFooter(
          translate(
            reminder.guildID,
            `commands/remind:REMINDING`,
            { id: reminder.reminderID },
          ),
        );

      if (guild?.channels.get(reminder.channelID)) {
        sendMessage(
          guild!.channels.get(reminder.channelID)!,
          {
            content: member.mention,
            embed,
            mentions: { users: [member.user.id] },
          },
        );
      }

      if (reminder.recurring && reminder.interval) {
        let newTimestamp = reminder.timestamp + reminder.interval;

        while (newTimestamp < now) {
          newTimestamp = newTimestamp + reminder.interval;
        }

        return remindersDatabase.updateOne(
          { reminderID: reminder.reminderID },
          {
            $set: { timestamp: newTimestamp },
          },
        );
      }

      // If its not recurring we delete it
      return remindersDatabase.deleteOne({ reminderID: reminder.reminderID });
    });
  },
});
