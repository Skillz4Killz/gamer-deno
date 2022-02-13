import { botCache } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles-default", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "name", type: "string", lowercase: true }] as const,
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args) => {
    return message.reply('/roles default')
    // const exists = await db.defaultrolesets.findOne({
    //   name: args.name,
    //   guildID: message.guildID,
    // });
    // if (!exists) return botCache.helpers.reactError(message);

    // // Create a roleset
    // await db.defaultrolesets.deleteOne({
    //   name: args.name,
    //   guildID: message.guildID,
    // });

    // return botCache.helpers.reactSuccess(message);
  },
});
