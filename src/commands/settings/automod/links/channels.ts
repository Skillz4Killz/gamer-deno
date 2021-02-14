import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod-links", {
  name: "channels",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "channel", type: "guildtextchannel" },
  ] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);
    const links = new Set(settings?.linksChannelIDs);

    if (args.type === "add") {
      links.add(args.channel.id);
    } else {
      links.delete(args.channel.id);
    }

    await db.guilds.update(message.guildID, {
      linksChannelIDs: [...links.values()],
    });
    return botCache.helpers.reactSuccess(message);
  },
});
