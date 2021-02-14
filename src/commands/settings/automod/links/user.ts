import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod-links", {
  name: "user",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "member", type: "member" },
  ] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);
    const links = new Set(settings?.linksUserIDs);

    if (args.type === "add") {
      links.add(args.member.id);
    } else {
      links.delete(args.member.id);
    }

    await db.guilds.update(message.guildID, {
      linksUserIDs: [...links.values()],
    });
    return botCache.helpers.reactSuccess(message);
  },
});
