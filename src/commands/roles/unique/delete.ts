import { botCache } from "../../../../mod.ts";
import { Role, addReaction } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { uniqueRoleSetsDatabase } from "../../../database/schemas/uniquerolesets.ts";

createSubcommand("roles-unique", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
  ],
  guildOnly: true,
  execute: async (message, args: RoleUniqueDeleteArgs) => {
    const exists = await uniqueRoleSetsDatabase.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return addReaction(message.channelID, message.id, "❌");

    // Create a roleset
    uniqueRoleSetsDatabase.deleteOne({
      name: args.name,
      guildID: message.guildID,
    });

    return addReaction(
      message.channelID,
      message.id,
      botCache.constants.emojis.success,
    );
  },
});

interface RoleUniqueDeleteArgs {
  name: string;
}
