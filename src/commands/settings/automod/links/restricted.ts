import { botCache, Member } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod-links", {
  name: "restricted",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "url", type: "string" },
  ],
  execute: async function (message, args: SettingsAutomodLinksURLArgs) {
    const settings = await db.guilds.get(message.guildID);
    const links = new Set(settings?.linksRestrictedURLs);

    if (args.type === "add") {
      links.add(args.url);
    } else {
      links.delete(args.url);
    }

    db.guilds.update(
      message.guildID,
      { linksRestrictedURLs: [...links.values()] },
    );
    botCache.helpers.reactSuccess(message);
  },
});

interface SettingsAutomodLinksURLArgs {
  type: "add" | "remove";
  url: string;
}
