import { botCache, Role } from "../../../../../deps.ts";
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
  ],
  execute: async function (message, args: SettingsAutomodLinksRoleArgs) {
    const settings = await db.guilds.get(message.guildID);
    const links = new Set(settings?.linksRoleIDs);

    if (args.type === "add") {
      links.add(args.role.id);
    } else {
      links.delete(args.role.id);
    }

    db.guilds.update(
      message.guildID,
      { linksRoleIDs: [...links.values()] },
    );
    botCache.helpers.reactSuccess(message);
  },
});

interface SettingsAutomodLinksRoleArgs {
  type: "add" | "remove";
  role: Role;
}
