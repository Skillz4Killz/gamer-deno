import { botCache, getMessage, getMessages } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "export",
  permissionLevels: [PermissionLevels.ADMIN],
  vipServerOnly: true,
  guildOnly: true,
  arguments: [
    { name: "messageID", type: "snowflake" },
    { name: "channel", type: "guildtextchannel" },
  ] as const,
  execute: async function (message, args, guild) {
    const settings = await db.guilds.get(message.guildID);
    if (!settings || ![settings.ideaChannelID, settings.bugsChannelID].includes(args.channel.id)) {
      return botCache.helpers.reactError(message);
    }

    const feedbackMessage = await getMessage(args.channel.id, args.messageID);
    if (!feedbackMessage) return botCache.helpers.reactError(message);

    const messages = await getMessages(args.channel.id, {
      limit: 100,
      after: args.messageID,
    });

    const [embed] = feedbackMessage.embeds;
    if (!embed || !embed.fields) return botCache.helpers.reactError(message);

    const csvArray = [
      embed.fields.map((field) => field.name).join(`;`),
      embed.fields.map((field) => field.value).join(`;`),
    ];
    for (const msg of messages || []) {
      const [msgEmbed] = msg.embeds;
      if (!msgEmbed || !msgEmbed.fields) continue;
      csvArray.push(msgEmbed.fields.map((field) => field.value).join(";"));
    }

    await message.reply({
      file: { blob: new Blob(csvArray), name: "output.csv" },
    });
  },
});
