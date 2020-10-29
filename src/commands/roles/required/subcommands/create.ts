import type { Role } from "../../../../../deps.ts";

import { botCache } from "../../../../../cache.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("roles-required", {
  name: "create",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "requiredRole", type: "role" },
    { name: "roles", type: "...roles" },
  ],
  guildOnly: true,
  execute: async (message, args: RoleRequiredCreateArg) => {
    const exists = await db.requiredrolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (exists) return botCache.helpers.reactError(message);

    // Create a roleset
    db.requiredrolesets.create(message.id, {
      name: args.name,
      requiredRoleID: args.requiredRole.id,
      roleIDs: args.roles.map((role) => role.id),
      guildID: message.guildID,
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleRequiredCreateArg {
  name: string;
  requiredRole: Role;
  roles: Role[];
}
