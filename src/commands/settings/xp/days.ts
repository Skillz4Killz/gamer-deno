import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-xp-decay", {
  name: "days",
  aliases: ["day", "d"],
  permissionLevels: [PermissionLevels.ADMIN],
  vipServerOnly: true,
  arguments: [{ name: "amount", type: "number", minimum: 1, maximum: 100 }] as const,
  execute: async function (message, args) {
    await db.guilds.update(message.guildID, { xpDecayDays: args.amount });
    return botCache.helpers.reactSuccess(message);
  },
});
