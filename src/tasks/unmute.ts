import { botCache, cache, editMember, getMember } from "../../deps.ts";
import { db } from "../database/database.ts";

botCache.tasks.set(`unmute`, {
  name: `unmute`,
  interval: botCache.constants.milliseconds.MINUTE * 2,
  execute: async function () {
    const now = Date.now();
    const mutedLogs = await db.mutes.findMany((m) => m.unmuteAt <= now);

    mutedLogs.forEach(async (log) => {
      // Check if the bot is in the guild before fetching the database.
      const guild = cache.guilds.get(log.guildID);
      if (!guild) return;

      // Get the guild settings to get the mute role id
      const settings = await db.guilds.get(log.guildID);
      // If there is no guildsettings or no role id skip
      if (!settings?.muteRoleID) return;

      // If the mute role is not present in the guild, skip.
      if (!guild.roles.has(settings.muteRoleID)) return;

      const member = cache.members.get(log.userID) || (await getMember(log.guildID, log.userID).catch(console.log));
      if (!member) return;

      const guildMember = member.guilds.get(log.guildID);
      if (!guildMember?.roles.includes(settings.muteRoleID)) return;

      const roleIDs = new Set([...guildMember.roles, ...log.roleIDs]);
      roleIDs.delete(settings.muteRoleID);

      // Since the time has fully elapsed we need to remove the role on the user
      await editMember(log.guildID, log.userID, {
        roles: [...roleIDs.values()],
      });
    });
  },
});
