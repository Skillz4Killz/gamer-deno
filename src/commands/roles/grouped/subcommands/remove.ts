import type { Role } from "../../../../../deps.ts";

import { botCache } from "../../../../../cache.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("roles-grouped", {
  name: "remove",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "roles", type: "...roles" },
  ],
  guildOnly: true,
  execute: async (message, args: RoleGroupedRemoveArgs) => {
    const exists = await db.groupedrolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    const roleIDs = args.roles.map((role) => role.id);

    db.groupedrolesets.updateOne(
      { name: args.name, guildID: message.guildID },
      {
        roleIDs: exists.roleIDs.filter((id) => !roleIDs.includes(id)),
      },
    );

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleGroupedRemoveArgs {
  name: string;
  roles: Role[];
}
