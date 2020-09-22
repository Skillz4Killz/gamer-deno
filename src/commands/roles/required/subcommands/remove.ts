import { botCache } from "../../../../../mod.ts";
import type { Role } from "../../../../../deps.ts";
import type { createSubcommand } from "../../../../utils/helpers.ts";
import type { PermissionLevels } from "../../../../types/commands.ts";
import type { requiredRoleSetsDatabase } from "../../../../database/schemas/requiredrolesets.ts";

createSubcommand("roles-required", {
  name: "remove",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "roles", type: "...roles" },
  ],
  guildOnly: true,
  execute: async (message, args: RoleRequiredRemoveArgs) => {
    const exists = await requiredRoleSetsDatabase.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    const roleIDs = args.roles.map((role) => role.id);

    requiredRoleSetsDatabase.updateOne(
      { name: args.name, guildID: message.guildID },
      {
        $set: { roleIDs: exists.roleIDs.filter((id) => !roleIDs.includes(id)) },
      },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleRequiredRemoveArgs {
  name: string;
  roles: Role[];
}
