import { botCache } from "../../mod.ts";
import { PermissionLevels } from "../types/commands.ts";
import { memberIDHasPermission } from "../../deps.ts";
import { guildsDatabase } from "../database/schemas/guilds.ts";

// The member using the command must be an admin. (Required ADMIN server perm.)
botCache.permissionLevels.set(
  PermissionLevels.ADMIN,
  async (message) => {
    const hasAdminPerm = memberIDHasPermission(
      message.author.id,
      message.guildID,
      ["ADMINISTRATOR"],
    );
    if (hasAdminPerm) return true;

    // If they lack the admin perms we can make a database call.
    const settings = await guildsDatabase.findOne({ guildID: message.guildID });
    if (!settings) return false;

    return botCache.helpers.isAdmin(message);
  },
);
