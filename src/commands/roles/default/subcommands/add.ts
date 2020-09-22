import { botCache } from "../../../../../mod.ts";
import type { Role } from "../../../../../deps.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import type { defaultRoleSetsDatabase } from "../../../../database/schemas/defaultrolesets.ts";

createSubcommand("roles-default", {
  name: "add",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "roles", type: "...roles" },
  ],
  guildOnly: true,
  execute: async (message, args: RoleDefaultAddArgs) => {
    const exists = await defaultRoleSetsDatabase.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    const roleIDs = new Set(
      [...exists.roleIDs, ...args.roles.map((role) => role.id)],
    );

    // Create a roleset
    defaultRoleSetsDatabase.updateOne(
      { name: args.name, guildID: message.guildID },
      { $set: { roleIDs: [...roleIDs.values()] } },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleDefaultAddArgs {
  name: string;
  roles: Role[];
}
