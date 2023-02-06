import { botCache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("settings", {
  name: "autoreact",
  arguments: [
    { name: "channel", type: "guildtextchannel" },
    { name: "emojis", type: "...emojis" },
  ] as const,
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async (message, args) => {
    await db.autoreact.update(args.channel.id, {
      id: args.channel.id,
      reactions: args.emojis,
      guildID: message.guildID,
    });
    botCache.autoreactChannelIDs.add(args.channel.id);

    return botCache.helpers.reactSuccess(message);
  },
});
