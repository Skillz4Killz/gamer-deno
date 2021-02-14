import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-xp", {
  name: "missions",
  aliases: ["mission", "m"],
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "enabled", type: "boolean" }] as const,
  execute: async function (message, args) {
    await db.guilds.update(message.guildID, { missionsDisabled: args.enabled });
    return botCache.helpers.reactSuccess(message);
  },
});
