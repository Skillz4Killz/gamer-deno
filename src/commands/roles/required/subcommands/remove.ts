import type { Role } from "../../../../../deps.ts";

import { botCache } from "../../../../../mod.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("roles-required", {
  name: "remove",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "roles", type: "...roles" },
  ],
  guildOnly: true,
  execute: async (message, args: RoleRequiredRemoveArgs) => {
    const exists = await db.requiredrolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    const roleIDs = args.roles.map((role) => role.id);

    db.requiredrolesets.updateOne(
      { name: args.name, guildID: message.guildID },
      {
        roleIDs: exists.roleIDs.filter((id) => !roleIDs.includes(id)),
      },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleRequiredRemoveArgs {
  name: string;
  roles: Role[];
}
