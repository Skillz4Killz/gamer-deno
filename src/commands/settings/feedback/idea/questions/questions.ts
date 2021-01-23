import { botCache } from "../../../../../../cache.ts";
import { db } from "../../../../../database/database.ts";
import { PermissionLevels } from "../../../../../types/commands.ts";
import { Embed } from "../../../../../utils/Embed.ts";
import { createSubcommand, sendEmbed } from "../../../../../utils/helpers.ts";

createSubcommand("settings-feedback-idea", {
  name: "questions",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
  execute: async (message, args) => {
    const settings = await db.guilds.get(message.guildID);
    if (!settings) return botCache.helpers.reactError(message);

    const ideaEmbed = botCache.helpers.authorEmbed(message);
    const bugsEmbed = botCache.helpers.authorEmbed(message);

    for (const data of settings.ideaQuestions) {
      ideaEmbed.addField(data.name, data.text);
    }

    for (const data of settings.bugsQuestions) {
      bugsEmbed.addField(data.name, data.text);
    }

    await sendEmbed(message.channelID, ideaEmbed);
    await sendEmbed(message.channelID, bugsEmbed);
  },
});
