import { botCache } from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { db } from "../../../database/database.ts";

createSubcommand("roles-unique", {
  name: "create",
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "roles", type: "...roles" },
  ] as const,
  guildOnly: true,
  vipServerOnly: true,
  execute: async (message, args) => {
    return message.reply('/roles unique')
    // const exists = await db.uniquerolesets.findOne({
    //   name: args.name,
    //   guildID: message.guildID,
    // });
    // if (exists) return botCache.helpers.reactError(message);

    // // Create a roleset
    // await db.uniquerolesets.create(message.id, {
    //   name: args.name,
    //   roleIDs: args.roles.map((role) => role.id),
    //   guildID: message.guildID,
    // });

    // return botCache.helpers.reactSuccess(message);
  },
});
