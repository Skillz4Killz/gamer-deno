import type { Guild, Overwrite } from "../../../../deps.ts";

import {
  botHasPermission,
  botID,
  ChannelTypes,
  createGuildChannel,
  memberIDHasPermission,
  OverwriteType,
  Permissions,
} from "../../../../deps.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../cache.ts";
import { db } from "../../../database/database.ts";

createSubcommand("todo", {
  name: "setup",
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.BOT_OWNER],
  guildOnly: true,
  botServerPermissions: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "EMBED_LINKS",
    "ADD_REACTIONS",
    "READ_MESSAGE_HISTORY",
    "USE_EXTERNAL_EMOJIS",
    "MANAGE_CHANNELS",
    "MANAGE_ROLES",
  ],
  arguments: [
    { name: "guild", type: "guild", required: false },
  ],
  execute: async (message, args: ToDoSetupArgs, guild) => {
    if (!guild) return;

    if (args.guild) {
      // Cross server features need vip
      if (!botCache.vipGuildIDs.has(message.guildID)) {
        return botCache.helpers.reactError(message, true);
      }

      // Make sure this member is the admin on the other server
      if (
        !(await memberIDHasPermission(
          message.author.id,
          args.guild.id,
          ["ADMINISTRATOR"],
        ))
      ) {
        return botCache.helpers.reactError(message, true);
      }

      // Since it's another guild make sure bot has perms over there
      if (
        !(await botHasPermission(args.guild.id, ["ADMINISTRATOR"]))
      ) {
        return botCache.helpers.reactError(message, true);
      }
    }

    const overwrites: Overwrite[] = [
      {
        id: botID,
        allow: [
          "VIEW_CHANNEL",
          "SEND_MESSAGES",
          "EMBED_LINKS",
          "ADD_REACTIONS",
          "READ_MESSAGE_HISTORY",
          "USE_EXTERNAL_EMOJIS",
          "MANAGE_CHANNELS",
          "MANAGE_ROLES",
        ],
        deny: [],
        type: OverwriteType.MEMBER,
      },
    ];

    const guildToUse = args.guild || guild;

    const settings = await botCache.helpers.upsertGuild(guildToUse.id);
    if (settings) {
      // Allow mods/admins to view this category
      for (const id of [...settings.modRoleIDs, settings.adminRoleID]) {
        // Clear out the id if it doesnt exist
        if (!id || !guildToUse.roles.has(id)) continue;

        overwrites.push(
          { id, allow: ["VIEW_CHANNEL"], deny: [], type: OverwriteType.ROLE },
        );
      }
    }

    // Create the To Do category
    const category = await createGuildChannel(
      guildToUse,
      "To Do",
      { type: ChannelTypes.GUILD_CATEGORY, permissionOverwrites: overwrites },
    );

    // Create a backlog channel
    const [
      currentSprintChannel,
      nextSprintChannel,
      backlogChannel,
      completedChannel,
      archivedChannel,
    ] = await Promise.all([
      // Create the current sprint channel
      createGuildChannel(
        guildToUse,
        "current-sprint",
        { type: ChannelTypes.GUILD_TEXT, parent_id: category.id },
      ),
      // Create the next sprint channel
      createGuildChannel(
        guildToUse,
        "next-sprint",
        { type: ChannelTypes.GUILD_TEXT, parent_id: category.id },
      ),
      // Create the backlog channel where new issues will be added
      createGuildChannel(
        guildToUse,
        "backlog",
        { type: ChannelTypes.GUILD_TEXT, parent_id: category.id },
      ),
      // Create the completed channel where new issues will be added
      createGuildChannel(
        guildToUse,
        "completed",
        { type: ChannelTypes.GUILD_TEXT, parent_id: category.id },
      ),
      // Create the archived channel where new issues will be added
      createGuildChannel(
        guildToUse,
        "archived",
        { type: ChannelTypes.GUILD_TEXT, parent_id: category.id },
      ),
    ]);

    await db.guilds.update(message.guildID, {
      todoBacklogChannelID: backlogChannel.id,
      todoCurrentSprintChannelID: currentSprintChannel.id,
      todoNextSprintChannelID: nextSprintChannel.id,
      todoArchivedChannelID: archivedChannel.id,
      todoCompletedChannelID: completedChannel.id,
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface ToDoSetupArgs {
  guild?: Guild;
}
