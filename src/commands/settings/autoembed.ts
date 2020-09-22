import { botCache } from "../../../mod.ts";
import type { PermissionLevels } from "../../types/commands.ts";
import type { guildsDatabase } from "../../database/schemas/guilds.ts";
import type { Channel, addReaction } from "../../../deps.ts";

botCache.commands.set("autoembed", {
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
      guildsDatabase.updateOne({ guildID: guild.id }, {
        $set: {
          autoembedChannelIDs: settings.autoembedChannelIDs.filter((id) =>
            id !== args.channel.id
          ),
        },
      });
      addReaction(message.channelID, message.id, "✅");
      return;
    }

    guildsDatabase.updateOne(
      { guildID: guild.id },
      {
        $set: {
          autoembedChannelIDs: [
            ...settings.autoembedChannelIDs,
            args.channel.id,
          ],
        },
      },
    );

    botCache.autoEmbedChannelIDs.add(args.channel.id);
    addReaction(message.channelID, message.id, "✅");
  },
});

interface AutoEmbedArgs {
  channel: Channel;
}
