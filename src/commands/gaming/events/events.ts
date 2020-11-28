import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import {
  createCommand,
  humanizeMilliseconds,
  sendEmbed,
} from "../../../utils/helpers.ts";

createCommand({
  name: "events",
  aliases: ["e"],
  cooldown: {
    seconds: 30,
  },
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
  ],
  execute: async function (message) {
    const events =
      (await db.events.findMany({ guildID: message.guildID }, true)).sort((
        a,
        b,
      ) => a.eventID - b.eventID);

    const embed = botCache.helpers.authorEmbed(message);

    const responses = botCache.helpers.chunkStrings(events.map((event) => {
      let textString = `**[${event.eventID}] `;

      if (event.isRecurring) {
        textString += ` 🔁 (${humanizeMilliseconds(event.frequency)}) `;
      }

      textString += `${event.title}**\n`;
      textString +=
        `<:dotgreen:441301429555036160>\`[${event.acceptedUsers.length} / ${event.maxAttendees}]\`<:dotyellow:441301443337781248>\`[${event.waitingUsers.length}]\`<:dotred:441301715493584896>\`[${event.deniedUserIDs.length}]\` `;

      if (event.startsAt > message.timestamp) {
        textString += `starts in \`${
          humanizeMilliseconds(event.startsAt - message.timestamp)
        }\``;
      } else if (event.endsAt > message.timestamp) {
        textString += `ends in \`${
          humanizeMilliseconds(event.endsAt - message.timestamp)
        }\``;
      } else {
        textString += `ended \`${
          humanizeMilliseconds(message.timestamp - event.endsAt)
        }\` ago.`;
      }

      return textString;
    }));

    for (const response of responses) {
      embed.setDescription(response);
      sendEmbed(message.channelID, embed);
    }
  },
});
