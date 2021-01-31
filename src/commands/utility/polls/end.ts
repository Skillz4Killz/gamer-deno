import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("polls", {
  name: "end",
  arguments: [{ name: "id", type: "snowflake" }],
  guildOnly: true,
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  execute: async function (message, args) {
    const poll = await db.polls.get(args.id);
    if (!poll) return botCache.helpers.reactError(message);

    // Calculate results: Option | # | %
    return botCache.helpers.processPollResults(poll);
  },
});
