import { botCache } from "../../../../../../cache.ts";
import { db } from "../../../../../database/database.ts";
import { PermissionLevels } from "../../../../../types/commands.ts";
import { createSubcommand } from "../../../../../utils/helpers.ts";

createSubcommand("settings-feedback-bugs", {
  name: "questions",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  execute: async (message) => {
    const settings = await db.guilds.get(message.guildID);
    if (!settings) return botCache.helpers.reactError(message);

    const embed = botCache.helpers.authorEmbed(message);

    for (const data of settings.bugsQuestions) {
      embed.addField(data.name, data.text);
    }

    return message.send({ embed });
  },
});
