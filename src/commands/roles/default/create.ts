import { botCache } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles-default", {
  name: "create",
  botChannelPermissions: ["MANAGE_ROLES"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "defaultRole", type: "role" },
    { name: "roles", type: "...roles" },
  ] as const,
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args, guild) => {
    return message.reply('/roles default')
    // const exists = await db.defaultrolesets.findOne({
    //   name: args.name,
    //   guildID: message.guildID,
    // });
    // if (exists) return botCache.helpers.reactError(message);

    // // Create a roleset
    // await db.defaultrolesets.create(message.id, {
    //   id: message.id,
    //   name: args.name,
    //   defaultRoleID: args.defaultRole.id,
    //   roleIDs: args.roles.map((role) => role.id),
    //   guildID: message.guildID,
    // });

    // // Add this role to all users without those roles
    // botCache.commands.get("roles")?.subcommands?.get("all")?.execute?.(
    //   message,
    //   // @ts-ignore
    //   { type: "add", role: args.defaultRole, defaultRoles: args.roles },
    //   guild
    // );

    // return botCache.helpers.reactSuccess(message);
  },
});
