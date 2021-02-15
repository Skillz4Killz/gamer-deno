import { botCache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "autoembed",
  arguments: [{ name: "channel", type: "guildtextchannel" }] as const,
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.MEMBER],
  botChannelPermissions: ["ADD_REACTIONS"],
  execute: async (message, args, guild) => {
    if (!guild) return;

    const settings = await botCache.helpers.upsertGuild(guild.id);
    if (!settings) return;

    if (settings.autoembedChannelIDs?.includes(args.channel.id)) {
      botCache.autoEmbedChannelIDs.delete(args.channel.id);
      await db.guilds.update(guild.id, {
        autoembedChannelIDs: settings.autoembedChannelIDs.filter((id) => id !== args.channel.id),
      });
      return botCache.helpers.reactSuccess(message);
    }

    await db.guilds.update(guild.id, {
      autoembedChannelIDs: [...(settings.autoembedChannelIDs || []), args.channel.id],
    });

    botCache.autoEmbedChannelIDs.add(args.channel.id);
    return botCache.helpers.reactSuccess(message);
  },
});
