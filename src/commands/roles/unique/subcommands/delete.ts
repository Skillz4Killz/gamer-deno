import { botCache } from "../../../../../cache.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("roles-unique", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
  ],
  guildOnly: true,
  execute: async (message, args: RoleUniqueDeleteArgs) => {
    const exists = await db.uniquerolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    // Create a roleset
    db.uniquerolesets.deleteOne({
      name: args.name,
      guildID: message.guildID,
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleUniqueDeleteArgs {
  name: string;
}
