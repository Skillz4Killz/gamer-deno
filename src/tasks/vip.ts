import { configs } from "../../configs.ts";
import { botCache, cache, Member } from "../../deps.ts";
import { db } from "../database/database.ts";

botCache.tasks.set("vip", {
  name: "vip",
  interval: botCache.constants.milliseconds.DAY,
  execute: async function () {
    const members: Member[] = [];

    for (const member of cache.members.values()) {
      // Since this member is not cached as a VIP, we can safely continue
      if (!botCache.vipUserIDs.has(member.id)) continue;

      const supportServerMember = member.guilds.get(configs.supportServerID);
      if (
        !supportServerMember ||
        (![
          configs.roleIDs.patreonRoleIDs.firstTier,
          configs.roleIDs.patreonRoleIDs.secondTier,
          configs.roleIDs.patreonRoleIDs.thirdTier,
        ].some((roleID) => supportServerMember.roles.includes(roleID)) &&
          !configs.userIDs.botOwners.includes(member.id))
      ) {
        botCache.vipUserIDs.delete(member.id);
        await db.users.update(member.id, { vipGuildIDs: [], isVIP: false });
        continue;
      }

      members.push(member);
    }

    const validVIPGuildIDs = new Set<string>();

    // ONLY VIP MEMBERS REMAIN
    for (const member of members.values()) {
      const settings = await db.users.get(member.id);
      if (!settings?.vipGuildIDs) continue;

      const supportServerMember = member.guilds.get(configs.supportServerID);
      if (!supportServerMember) continue;

      const allowedVIPServers = configs.userIDs.botOwners.includes(member.id)
        ? Infinity
        : supportServerMember.roles.includes(
            configs.roleIDs.patreonRoleIDs.thirdTier
          )
        ? 3
        : supportServerMember.roles.includes(
            configs.roleIDs.patreonRoleIDs.secondTier
          )
        ? 2
        : 1;

      if (allowedVIPServers < settings.vipGuildIDs.length) {
        settings.vipGuildIDs = settings.vipGuildIDs.slice(0, allowedVIPServers);

        await db.users.update(settings.id, {
          vipGuildIDs: settings.vipGuildIDs,
        });
      }

      settings.vipGuildIDs.forEach(validVIPGuildIDs.add, validVIPGuildIDs);
    }

    // Remove guilds that are no longer VIP
    for (const guildID of botCache.vipGuildIDs) {
      if (validVIPGuildIDs.has(guildID)) continue;

      botCache.vipGuildIDs.delete(guildID),
        await db.guilds.update(guildID, { isVIP: false });
    }
  },
});
