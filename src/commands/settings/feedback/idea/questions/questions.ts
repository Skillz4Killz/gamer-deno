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

    const embed = new Embed();

    for (const data of [...settings.ideaQuestions, ...settings.bugsQuestions]) {
      embed.addField(data.name, data.text);
    }

    await sendEmbed(message.channelID, embed);
  },
});
