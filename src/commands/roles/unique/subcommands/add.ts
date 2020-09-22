import { botCache } from "../../../../../mod.ts";
import type { Role } from "../../../../../deps.ts";
import type { createSubcommand } from "../../../../utils/helpers.ts";
import type { PermissionLevels } from "../../../../types/commands.ts";
import type { uniqueRoleSetsDatabase } from "../../../../database/schemas/uniquerolesets.ts";

createSubcommand("roles-unique", {
  name: "add",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "roles", type: "...roles" },
  ],
  guildOnly: true,
  execute: async (message, args: RoleUniqueAddArgs) => {
    const exists = await uniqueRoleSetsDatabase.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    const roleIDs = new Set(
      [...exists.roleIDs, ...args.roles.map((role) => role.id)],
    );

    // Create a roleset
    uniqueRoleSetsDatabase.updateOne(
      { name: args.name, guildID: message.guildID },
      { $set: { roleIDs: [...roleIDs.values()] } },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleUniqueAddArgs {
  name: string;
  roles: Role[];
}
