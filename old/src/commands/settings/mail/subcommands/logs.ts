import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-mails", {
  name: "logs",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [{ name: "channel", type: "guildtextchannel", required: false }] as const,
  execute: async function (message, args) {
    await db.guilds.update(message.guildID, {
      mailsLogChannelID: args.channel?.id,
    });

    // Support channels are also cached
    if (args.channel) {
      botCache.guildMailLogsChannelIDs.set(message.guildID, args.channel.id);
    } else {
      botCache.guildMailLogsChannelIDs.delete(message.guildID);
    }

    return botCache.helpers.reactSuccess(message);
  },
});
