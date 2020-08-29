import { botCache } from "../../../../mod.ts";
import { Role, addReaction } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { uniqueRoleSetsDatabase } from "../../../database/schemas/uniquerolesets.ts";

createSubcommand("roles-unique", {
  name: "remove",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "roles", type: "...roles" },
  ],
  guildOnly: true,
  execute: async (message, args: RoleUniqueRemoveArgs) => {
    const exists = await uniqueRoleSetsDatabase.findOne({
      name: args.name,
      guildID: message.guildID,
    });
    if (!exists) return addReaction(message.channelID, message.id, "❌");

    const roleIDs = args.roles.map((role) => role.id);

    uniqueRoleSetsDatabase.updateOne(
      { name: args.name, guildID: message.guildID },
      {
        $set: { roleIDs: exists.roleIDs.filter((id) => !roleIDs.includes(id)) },
      },
    );

    return addReaction(
      message.channelID,
      message.id,
      botCache.constants.emojis.success,
    );
  },
});

interface RoleUniqueRemoveArgs {
  name: string;
  roles: Role[];
}
