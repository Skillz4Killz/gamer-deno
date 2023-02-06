import { configs } from "../../../configs.ts";
import { botCache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "vip",
  guildOnly: true,
  cooldown: {
    seconds: 120,
    allowedUses: 2,
  },
  arguments: [{ name: "subcommand", type: "subcommand", required: false }],
  execute: async function (message) {
    // ALREADY VIP
    if (botCache.vipGuildIDs.has(message.guildID)) {
      return botCache.helpers.reactSuccess(message);
    }

    const member = message.member?.guilds.get(configs.supportServerID);
    if (!member) return botCache.helpers.reactError(message);

    const allowedVIPServers = configs.userIDs.botOwners.includes(message.author.id)
      ? Infinity
      : member.roles.includes(configs.roleIDs.patreonRoleIDs.thirdTier)
      ? 3
      : member.roles.includes(configs.roleIDs.patreonRoleIDs.secondTier)
      ? 2
      : member.roles.includes(configs.roleIDs.patreonRoleIDs.firstTier)
      ? 1
      : 0;
    // if (!allowedVIPServers) return botCache.helpers.reactError(message, true);

    // Check if they have used all the vips.
    const settings = await db.vipUsers.get(message.author.id);
    if (settings?.guildIDs && settings.guildIDs.length >= allowedVIPServers) {
      // return botCache.helpers.reactError(message, true);
    }

    await db.vipUsers.update(message.author.id, {
      guildIDs: [...(settings?.guildIDs || []), message.guildID],
      isVIP: true,
    });
    await db.vipGuilds.update(message.guildID, { id: message.guildID, userID: message.author.id, isVIP: true });
    botCache.vipGuildIDs.add(message.guildID);
    botCache.vipUserIDs.add(message.author.id);

    return botCache.helpers.reactSuccess(message);
  },
});
