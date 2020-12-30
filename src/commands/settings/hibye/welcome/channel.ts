import { botCache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createCommand } from "../../../../utils/helpers.ts";

createCommand({
  name: "channel",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
  ] as const,
  execute: async function (message, args) {
    db.welcome.update(message.guildID, { channelID: args.channel?.id || "" });
    await botCache.helpers.reactSuccess(message);
  },
});
