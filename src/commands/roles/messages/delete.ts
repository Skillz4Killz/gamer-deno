import { Channel, Role } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../cache.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles-messages", {
  name: "delete",
  aliases: ["d"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "type", type: "string", literals: ["add", "remove"] }, { name: "role", type: "role" }],
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args: RoleMessageDeleteArgs, guild) => {
    const roleAdded = ['add'].includes(args.type);
    
    db.rolemessages.delete({ id: args.role.id, type: roleAdded })
    botCache.helpers.reactSuccess(message);
  },
});

interface RoleMessageDeleteArgs {
  type: "add" | "remove";
  role: Role;
}