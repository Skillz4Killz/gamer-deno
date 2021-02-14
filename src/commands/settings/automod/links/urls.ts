import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod-links", {
  name: "urls",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "url", type: "string" },
  ] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);
    const links = new Set(settings?.linksURLs);

    if (args.type === "add") {
      links.add(args.url);
    } else {
      links.delete(args.url);
    }

    await db.guilds.update(message.guildID, { linksURLs: [...links.values()] });
    return botCache.helpers.reactSuccess(message);
  },
});
