import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-mails", {
  name: "logs",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
  ] as const,
  execute: (message, args) => {
    db.guilds.update(message.guildID, {
      mailsSupportChannelID: args.channel?.id || "",
    });

    // Support channels are also cached
    if (args.channel) {
      botCache.guildSupportChannelIDs.set(message.guildID, args.channel.id);
    } else {
      botCache.guildSupportChannelIDs.delete(message.guildID);
    }

    botCache.helpers.reactSuccess(message);
  },
});
