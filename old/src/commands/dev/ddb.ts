// DEV PURPOSES ONLY
import { botCache, deleteMessages, getMessages } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { Command, createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "ddb",
  permissionLevels: [PermissionLevels.BOT_OWNER],
  execute: async function (message, args, guild) {
    let messages = await getMessages("813781802552262706", { limit: 100 }).catch(console.log);

    while (messages) {
      for (const msg of messages) {
        const final = JSON.parse(msg.content.substring(8, msg.content.length - 4));
        console.log(`DDB Processing: ${final.guildID}-${final.memberID}`);

        const current = await db.xp.get(`${final.guildID}-${final.memberID}`);

        await db.xp.update(`${final.guildID}-${final.memberID}`, {
          id: `${final.guildID}-${final.memberID}`,
          memberID: final.memberID,
          guildID: final.guildID,
          xp: final.leveling.xp + (current?.xp || 0),
          voiceXP: final.leveling.voicexp + (current?.voiceXP || 0),
          lastUpdatedAt: current?.lastUpdatedAt,
          joinedVoiceAt: current?.joinedVoiceAt,
        });
      }

      await deleteMessages(
        "813781802552262706",
        messages.map((m) => m.id)
      ).catch(console.log);
      messages = await getMessages("813781802552262706", { limit: 100 }).catch(console.log);
    }

    message.reply("finished");
  },
});
