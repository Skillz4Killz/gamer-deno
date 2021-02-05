import { configs } from "../../configs.ts";
import { botCache, cache } from "../../deps.ts";
import { db } from "../database/database.ts";

botCache.tasks.set("vip", {
  name: "vip",
  interval: botCache.constants.milliseconds.DAY,
  execute: async function () {
    const members = cache.members.filter((m) => {
      const supportServerMember = m.guilds.get(configs.supportServerID);
      if (!supportServerMember) return false;

      if (
        ![
          configs.roleIDs.patreonRoleIDs.firstTier,
          configs.roleIDs.patreonRoleIDs.secondTier,
          configs.roleIDs.patreonRoleIDs.thirdTier,
        ].some((roleID) => supportServerMember.roles.includes(roleID))
      ) {
        return false;
      }

      return true;
    });

    const validVIPGuildIDs = new Set<string>();

    // ONLY VIP MEMBERS REMAIN
    for (const member of members.values()) {
      console.log(member);
      const settings = await db.users.get(member.id);
      if (!settings?.vipGuildIDs) continue;

      const supportServerMember = member.guilds.get(configs.supportServerID);
      if (!supportServerMember) continue;

      const allowedVIPServers = supportServerMember.roles.includes(
        configs.roleIDs.patreonRoleIDs.thirdTier
      )
        ? 3
        : supportServerMember.roles.includes(
            configs.roleIDs.patreonRoleIDs.secondTier
          )
        ? 2
        : 1;

      for (let i = 0; i < allowedVIPServers; i++) {
        validVIPGuildIDs.add(settings.vipGuildIDs[i]);
      }

      if (allowedVIPServers < settings.vipGuildIDs.length) {
        await db.users.update(settings.id, {
          vipGuildIDs: settings.vipGuildIDs.slice(0, allowedVIPServers),
        });
      }
    }

    // CHECK WHICH GUILDS ARE NO LONGER VIP
    for (const guildID of botCache.vipGuildIDs) {
      if (validVIPGuildIDs.has(guildID)) continue;

      botCache.vipGuildIDs.delete(guildID),
        await db.guilds.update(guildID, { isVIP: false });
    }
  },
});
