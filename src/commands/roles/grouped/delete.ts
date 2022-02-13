import { botCache } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles-grouped", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "name", type: "string", lowercase: true }] as const,
  guildOnly: true,
  execute: async (message, args) => {
    return message.reply('/roles grouped')
    // const exists = await db.groupedrolesets.findOne({
    //   name: args.name,
    //   guildID: message.guildID,
    // });
    // if (!exists) return botCache.helpers.reactError(message);

    // // Create a roleset
    // await db.groupedrolesets.deleteOne({
    //   name: args.name,
    //   guildID: message.guildID,
    // });

    // return botCache.helpers.reactSuccess(message);
  },
});
