import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-tags", {
  name: "mail",
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{
    name: "name",
    type: "string",
    lowercase: true,
  }],
  execute: async function (message, args: SettingsTagsMailArgs) {
    const tagName = `${message.guildID}-${args.name}`;
    if (!botCache.tagNames.has(tagName)) {
      return botCache.helpers.reactError(message);
    }

    const tag = await db.tags.get(tagName);
    if (!tag) return botCache.helpers.reactError(message);

    db.tags.update(tagName, { mailOnly: !tag.mailOnly });
    botCache.helpers.reactSuccess(message);
  },
});

interface SettingsTagsMailArgs {
  name: string;
}
