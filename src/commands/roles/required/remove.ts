import { botCache } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles-required", {
  name: "remove",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "roles", type: "...roles" },
  ] as const,
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args) => {
    return message.reply('/roles required')
    // const exists = await db.requiredrolesets.findOne({
    //   name: args.name,
    //   guildID: message.guildID,
    // });
    // if (!exists) return botCache.helpers.reactError(message);

    // const roleIDs = args.roles.map((role) => role.id);

    // await db.requiredrolesets.updateOne(
    //   { name: args.name, guildID: message.guildID },
    //   {
    //     roleIDs: exists.roleIDs.filter((id) => !roleIDs.includes(id)),
    //   }
    // );

    // return botCache.helpers.reactSuccess(message);
  },
});
