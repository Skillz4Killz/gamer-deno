import type { Channel } from "../../../deps.ts";

import { addReaction } from "../../../deps.ts";
import { botCache } from "../../../mod.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "autoembed",
  arguments: [
    { name: "channel", type: "guildtextchannel" },
  ],
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MEMBER],
  botChannelPermissions: ["ADD_REACTIONS"],
  execute: async (message, args: AutoEmbedArgs, guild) => {
    if (!guild) return;

    const settings = await botCache.helpers.upsertGuild(guild.id);
    if (!settings) return;

    if (settings.autoembedChannelIDs.includes(args.channel.id)) {
      botCache.autoEmbedChannelIDs.delete(args.channel.id);
      db.guilds.update(guild.id, {
        autoembedChannelIDs: settings.autoembedChannelIDs.filter((id) =>
          id !== args.channel.id
        ),
      });
      addReaction(message.channelID, message.id, "✅");
      return;
    }

    db.guilds.update(guild.id, {
      autoembedChannelIDs: [
        ...settings.autoembedChannelIDs,
        args.channel.id,
      ],
    });

    botCache.autoEmbedChannelIDs.add(args.channel.id);
    addReaction(message.channelID, message.id, "✅");
  },
});

interface AutoEmbedArgs {
  channel: Channel;
}
