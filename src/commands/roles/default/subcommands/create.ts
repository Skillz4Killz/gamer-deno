import type { Role } from "../../../../../deps.ts";

import { botCache } from "../../../../../cache.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("roles-default", {
  name: "create",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "defaultRole", type: "role" },
    { name: "roles", type: "...roles" },
  ],
  guildOnly: true,
  execute: async (message, args: RoleDefaultCreateArg) => {
    const exists = await db.defaultrolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (exists) return botCache.helpers.reactError(message);

    // Create a roleset
    db.defaultrolesets.create(message.id, {
      name: args.name,
      defaultRoleID: args.defaultRole.id,
      roleIDs: args.roles.map((role) => role.id),
      guildID: message.guildID,
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleDefaultCreateArg {
  name: string;
  defaultRole: Role;
  roles: Role[];
}
