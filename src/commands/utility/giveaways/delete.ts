import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("giveaway", {
  name: "delete",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  aliases: ["d"],
  arguments: [{ name: "giveawayID", type: "snowflake" }] as const,
  execute: async function (message, args) {
    await db.giveaways.delete(args.giveawayID);
    botCache.giveawayMessageIDs.delete(args.giveawayID);
    return botCache.helpers.reactSuccess(message);
  },
});
