import { botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("xp", {
  name: "reset",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "voice", type: "string", literals: ["voice"], required: false },
    { name: "member", type: "member", required: false },
    { name: "role", type: "role", required: false },
  ] as const,
  execute: async function (message, args) {
    if (args.voice) {}
    // If a member was passed we want to reset this members XP only
    if (args.member) {
      const settings = await db.xp.get(`${message.guildID}-${args.member.id}`);
      if (!settings) return botCache.helpers.reactSuccess(message);

      if (args.voice) {
        db.xp.update(`${message.guildID}-${args.member.id}`, { voiceXP: 0 });
      } else {
        botCache.helpers.removeXP(message.guildID, args.member.id, settings.xp);
      }

      return botCache.helpers.reactSuccess(message);
    }

    // Only vips can return with a role
    if (!args.role || !botCache.vipGuildIDs.has(message.guildID)) {
      return botCache.helpers.reactError(message, true);
    }

    for (const member of cache.members.values()) {
      if (!member.guilds.has(message.guildID)) continue;

      const settings = await db.xp.get(`${message.guildID}-${member.id}`);
      if (!settings) continue;

      if (args.voice) {
        db.xp.update(`${message.guildID}-${member.id}`, { voiceXP: 0 });
      } else botCache.helpers.removeXP(message.guildID, member.id, settings.xp);
    }

    botCache.helpers.reactSuccess(message);
  },
});
