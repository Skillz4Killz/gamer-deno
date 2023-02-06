import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-xp", {
  name: "channel",
  aliases: ["c"],
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{ name: "channel", type: "guildtextchannel" }] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);

    if (settings?.disabledXPChannelIDs.includes(args.channel.id)) {
      await db.guilds.update(message.guildID, {
        disabledXPChannelIDs: settings.disabledXPChannelIDs.filter((id) => id !== args.channel.id),
      });
    } else {
      await db.guilds.update(message.guildID, {
        disabledXPChannelIDs: [...(settings?.disabledXPChannelIDs || []), args.channel.id],
      });
    }

    return botCache.helpers.reactSuccess(message);
  },
});
