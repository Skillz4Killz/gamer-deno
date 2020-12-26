import { cache } from "https://raw.githubusercontent.com/discordeno/discordeno/next/src/util/cache.ts";
import { botCache } from "../../cache.ts";
import { configs } from "../../configs.ts";
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
      const settings = await db.users.get(member.id);
      if (!settings) continue;

      const supportServerMember = member.guilds.get(configs.supportServerID);
      if (!supportServerMember) continue;

      const allowedVIPServers = supportServerMember.roles.includes(
          configs.roleIDs.patreonRoleIDs.thirdTier,
        )
        ? 3
        : supportServerMember.roles.includes(
            configs.roleIDs.patreonRoleIDs.secondTier,
          )
        ? 2
        : 1;

      for (let i = 0; i < allowedVIPServers; i++) {
        validVIPGuildIDs.add(settings.vipGuildIDs[i]);
      }

      if (allowedVIPServers < settings.vipGuildIDs.length) {
        db.users.update(
          settings.id,
          { vipGuildIDs: settings.vipGuildIDs.slice(0, allowedVIPServers) },
        );
      }
    }

    // CHECK WHICH GUILDS ARE NO LONGER VIP
    const missingGuildIDs = [...botCache.vipGuildIDs.values()].filter(
      (guildID) => !validVIPGuildIDs.has(guildID),
    );
    for (const guildID of missingGuildIDs) {
      botCache.vipGuildIDs.delete(guildID);
      db.guilds.update(guildID, { isVIP: false });
    }
  },
});
