import { botCache } from "../../../../../mod.ts";
import type { createSubcommand } from "../../../../utils/helpers.ts";
import type { PermissionLevels } from "../../../../types/commands.ts";
import type { defaultRoleSetsDatabase } from "../../../../database/schemas/defaultrolesets.ts";

createSubcommand("roles-default", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
  ],
  guildOnly: true,
  execute: async (message, args: RoleDefaultDeleteArgs) => {
    const exists = await defaultRoleSetsDatabase.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    // Create a roleset
    defaultRoleSetsDatabase.deleteOne({
      name: args.name,
      guildID: message.guildID,
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleDefaultDeleteArgs {
  name: string;
}
