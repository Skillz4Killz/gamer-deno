import type { Channel } from "../../../../../deps.ts";
import { botCache } from "../../../../../cache.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("labels", {
  name: "create",
  aliases: ["c"],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "categoryID", type: "categorychannel" },
  ],
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async (message, args: LabelsCreateArgs) => {
    const labelExists = await db.labels.findOne({
      name: args.name,
      guildID: message.guildID,
    });

    if (labelExists) return botCache.helpers.reactError(message);

    db.labels.create(message.id, {
      userID: message.author.id,
      categoryID: args.category.id,
      guildID: message.guildID,
      name: args.name,
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface LabelsCreateArgs {
  name: string;
  category: Channel;
}
