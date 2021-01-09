import {
  botCache,
  cache,
  calculatePermissions,
  createGuildRole,
  editChannel,
  isChannelSynced,
  OverwriteType,
} from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings", {
  name: "mute",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.BOT_OWNER],
  botServerPermissions: ["ADMINISTRATOR"],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "type", type: "string", literals: ["setup", "disable"] },
  ] as const,
  execute: async function (message, args, guild) {
    if (!guild) return;

    if (args.type === "disable") {
      await db.guilds.update(message.guildID, { muteRoleID: "" });
      return botCache.helpers.reactSuccess(message);
    }

    // Run the setup

    const settings = await db.guilds.get(message.guildID);
    if (
      settings?.muteRoleID && guild.roles.has(settings.muteRoleID)
    ) {
      return botCache.helpers.reactError(message);
    }

    const role = await createGuildRole(message.guildID, { name: "Muted" });
    await db.guilds.update(message.guildID, { muteRoleID: role.id });

    cache.channels.forEach(async (channel) => {
      if (channel.guildID !== guild.id) return;

      // If the permissions are synced with the category channel skip
      if (channel.parentID) {
        const category = cache.channels.get(channel.parentID);
        if (!category) return;
        if (await isChannelSynced(channel.id)) return;
      }

      // Update the channel perms
      await editChannel(
        channel.id,
        {
          overwrites: [
            ...(channel.permissionOverwrites || []).map((o) => ({
              id: o.id,
              type: o.type,
              allow: calculatePermissions(BigInt(o.allow)),
              deny: calculatePermissions(BigInt(o.deny)),
            })),
            {
              id: role.id,
              type: OverwriteType.ROLE,
              allow: [],
              deny: ["VIEW_CHANNEL"],
            },
          ],
        },
      );
    });

    return botCache.helpers.reactSuccess(message);
  },
});
