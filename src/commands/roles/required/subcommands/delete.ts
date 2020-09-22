import { botCache } from "../../../../../mod.ts";
import type { createSubcommand } from "../../../../utils/helpers.ts";
import type { PermissionLevels } from "../../../../types/commands.ts";
import type { requiredRoleSetsDatabase } from "../../../../database/schemas/requiredrolesets.ts";

createSubcommand("roles-required", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
  ],
  guildOnly: true,
  execute: async (message, args: RoleRequiredDeleteArgs) => {
    const exists = await requiredRoleSetsDatabase.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    // Create a roleset
    requiredRoleSetsDatabase.deleteOne({
      name: args.name,
      guildID: message.guildID,
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleRequiredDeleteArgs {
  name: string;
}
