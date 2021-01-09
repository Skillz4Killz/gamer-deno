import { botCache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "restore",
  permissionLevels: [PermissionLevels.BOT_OWNER],
  arguments: [
    { name: "member", type: "member" },
    { name: "type", type: "string", literals: ["member", "user"] },
    { name: "data", type: "...string" },
  ] as const,
  execute: async function (message, args) {
    try {
      const json = JSON.parse(args.data);

      if (args.type === "member") {
        await db.xp.update(`${json.guildID}-${json.memberID}`, {
          memberID: json.memberID,
          guildID: json.guildID,
          xp: json.leveling.xp,
          voiceXP: json.leveling.voicexp,
          lastUpdatedAt: json.lastUpdatedAt,
          joinedVoiceAt: json.joinedVoiceAt,
        });
      }
    } catch (error) {
      return botCache.helpers.reactError(message);
    }
  },
});
