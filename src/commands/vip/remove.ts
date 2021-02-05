import { botCache, cache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("vip", {
  name: "remove",
  guildOnly: true,
  cooldown: {
    seconds: 120,
    allowedUses: 2,
  },
  permissionLevels: [PermissionLevels.SERVER_OWNER],
  execute: async function (message) {
    // The Server is not VIP
    if (!botCache.vipGuildIDs.has(message.guildID))
      return botCache.helpers.reactError(message);

    const member = cache.members.get(message.author.id);
    if (!member) return botCache.helpers.reactError(message);

    const userSettings = await db.users.get(message.author.id);
    if (!userSettings) return botCache.helpers.reactError(message);

    await db.users.update(message.author.id, {
      vipGuildIDs: userSettings.vipGuildIDs.filter(
        (id) => id !== message.guildID
      ),
    });
    await db.guilds.update(message.guildID, { isVIP: false });
    botCache.vipGuildIDs.delete(message.guildID);

    return botCache.helpers.reactSuccess(message);
  },
});
