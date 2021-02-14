import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-automod-links", {
  name: "roles",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "role", type: "role" },
  ] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);
    const links = new Set(settings?.linksRoleIDs);

    if (args.type === "add") {
      links.add(args.role.id);
    } else {
      links.delete(args.role.id);
    }

    await db.guilds.update(message.guildID, {
      linksRoleIDs: [...links.values()],
    });
    return botCache.helpers.reactSuccess(message);
  },
});
