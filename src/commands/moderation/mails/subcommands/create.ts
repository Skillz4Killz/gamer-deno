import { botCache } from "../../../../../deps.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { db } from "../../../../database/database.ts";

createSubcommand("labels", {
  name: "create",
  aliases: ["c"],
  arguments: [
    { name: "name", type: "string", lowercase: true },
    { name: "category", type: "categorychannel" },
  ] as const,
  cooldown: {
    seconds: 5,
    allowedUses: 2,
  },
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  execute: async (message, args) => {
    const labelExists = await db.labels.findOne({
      name: args.name,
      guildID: message.guildID,
    });

    if (labelExists) return botCache.helpers.reactError(message);

    await db.labels.create(message.id, {
      id: message.id,
      mainGuildID: message.guildID,
      userID: message.author.id,
      categoryID: args.category.id,
      guildID: message.guildID,
      name: args.name,
    });

    return botCache.helpers.reactSuccess(message);
  },
});
