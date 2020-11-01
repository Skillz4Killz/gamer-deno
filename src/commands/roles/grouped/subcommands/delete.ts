import { botCache } from "../../../../../cache.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("roles-grouped", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
  ],
  guildOnly: true,
  execute: async (message, args: RoleGroupedDeleteArgs) => {
    const exists = await db.groupedrolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    // Create a roleset
    db.groupedrolesets.deleteOne({
      name: args.name,
      guildID: message.guildID,
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleGroupedDeleteArgs {
  name: string;
}
