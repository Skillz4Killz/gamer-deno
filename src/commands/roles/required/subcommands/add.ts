import { botCache } from "../../../../../mod.ts";
import { Role } from "../../../../../deps.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { requiredRoleSetsDatabase } from "../../../../database/schemas/requiredrolesets.ts";

createSubcommand("roles-required", {
  name: "add",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "roles", type: "...roles" },
  ],
  guildOnly: true,
  execute: async (message, args: RoleRequiredAddArgs) => {
    const exists = await requiredRoleSetsDatabase.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    const roleIDs = new Set(
      [...exists.roleIDs, ...args.roles.map((role) => role.id)],
    );

    // Create a roleset
    requiredRoleSetsDatabase.updateOne(
      { name: args.name, guildID: message.guildID },
      { $set: { roleIDs: [...roleIDs.values()] } },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleRequiredAddArgs {
  name: string;
  roles: Role[];
}
