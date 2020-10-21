import type { Role } from "../../../../../deps.ts";

import { botCache } from "../../../../../mod.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("roles-default", {
  name: "add",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "roles", type: "...roles" },
  ],
  guildOnly: true,
  execute: async (message, args: RoleDefaultAddArgs) => {
    const exists = await db.defaultrolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    const roleIDs = new Set(
      [...exists.roleIDs, ...args.roles.map((role) => role.id)],
    );

    // Create a roleset
    db.defaultrolesets.updateOne(
      { name: args.name, guildID: message.guildID },
      { roleIDs: [...roleIDs.values()] },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleDefaultAddArgs {
  name: string;
  roles: Role[];
}
