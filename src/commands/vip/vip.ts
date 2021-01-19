import { botCache, cache } from "../../../deps.ts";
import { configs } from "../../../configs.ts";
import { db } from "../../database/database.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "vip",
  guildOnly: true,
  cooldown: {
    seconds: 120,
    allowedUses: 2,
  },
  execute: async function (message) {
    // ALREADY VIP
    if (botCache.vipGuildIDs.has(message.guildID)) {
      return botCache.helpers.reactSuccess(message);
    }

    const member = message.guildMember;
    if (!member) return botCache.helpers.reactError(message);

    const allowedVIPServers =
      member.roles.includes(configs.roleIDs.patreonRoleIDs.thirdTier)
        ? 3
        : member?.roles.includes(configs.roleIDs.patreonRoleIDs.secondTier)
        ? 2
        : member?.roles.includes(configs.roleIDs.patreonRoleIDs.firstTier)
        ? 1
        : 0;
    if (!allowedVIPServers) return botCache.helpers.reactError(message, true);

    // Check if they have used all the vips.
    const settings = await db.users.get(message.author.id);
    if (
      settings && settings.vipGuildIDs.length >= allowedVIPServers
    ) {
      return botCache.helpers.reactError(message, true);
    }

    await db.users.update(
      message.author.id,
      { vipGuildIDs: [...(settings?.vipGuildIDs || []), message.guildID], isVIP: true },
    );
    await db.guilds.update(message.guildID, { isVIP: true });
    botCache.vipGuildIDs.add(message.guildID);
    botCache.vipUserIDs.add(message.author.id);

    return botCache.helpers.reactSuccess(message);
  },
});
