import { botCache } from "../../../../../mod.ts";
import type { Role } from "../../../../../deps.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import type { defaultRoleSetsDatabase } from "../../../../database/schemas/defaultRolesets.ts";

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
    const exists = await defaultRoleSetsDatabase.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (exists) return botCache.helpers.reactError(message);

    // Create a roleset
    await defaultRoleSetsDatabase.insertOne({
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
