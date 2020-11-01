import { botCache } from "../../../../../cache.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("labels", {
  name: "delete",
  aliases: ["d"],
  arguments: [{ name: "name", type: "string", lowercase: true }],
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async (message, args: LabelsDeleteArgs) => {
    const deleted = await db.labels.deleteOne(
      { name: args.name, guildID: message.guildID },
    ).catch(() => undefined);
    if (!deleted) return botCache.helpers.reactError(message);
    return botCache.helpers.reactSuccess(message);
  },
});

interface LabelsDeleteArgs {
  name: string;
}
