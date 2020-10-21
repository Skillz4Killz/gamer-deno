import { botCache } from "../../../../../mod.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("roles-required", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
  ],
  guildOnly: true,
  execute: async (message, args: RoleRequiredDeleteArgs) => {
    const exists = await db.requiredrolesets.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return botCache.helpers.reactError(message);

    // Create a roleset
    db.requiredrolesets.deleteOne({
      name: args.name,
      guildID: message.guildID,
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface RoleRequiredDeleteArgs {
  name: string;
}
