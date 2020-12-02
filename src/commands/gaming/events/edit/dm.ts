import { botCache, cache } from "../../../../../deps.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("events-edit", {
  name: "dm",
  aliases: ["dms"],
  cooldown: {
    seconds: 30,
  },
  arguments: [
    { name: "eventID", type: "number" },
    { name: "enabled", type: "boolean" },
  ] as const,
  guildOnly: true,
  execute: async function (message, args, guild) {
    // Check if user has mod or admin perms
    const hasPerm =
      await botCache.permissionLevels.get(PermissionLevels.MODERATOR)?.(
        message,
        this,
        guild,
      ) ||
      await botCache.permissionLevels.get(PermissionLevels.ADMIN)?.(
        message,
        this,
        guild,
      );
    // Mod/admins bypass these checks
    if (!hasPerm) {
      const settings = await db.guilds.get(message.guildID);
      // User is not a mod admin so we have to see if they have the ability to create/edit these events.
      if (!settings?.createEventsRoleID) {
        return botCache.helpers.reactError(message);
      }

      // User does not have admin/mod or the necessary role so cancel out
      if (
        !cache.members.get(message.author.id)?.guilds.get(message.guildID)
          ?.roles.includes(settings.createEventsRoleID)
      ) {
        return botCache.helpers.reactError(message);
      }
    }

    // User has permission to run this command

    const event = await db.events.findOne(
      { eventID: args.eventID, guildID: message.guildID },
    );
    if (!event) return botCache.helpers.reactError(message);

    // If the user wasnt a mod or admin we have to make sure thy are the creator of this event
    if (!hasPerm && message.author.id !== event.userID) {
      return botCache.helpers.reactError(message);
    }

    // All necessary checks complete
    db.events.update(event.id, { dmReminders: args.enabled });
    botCache.helpers.reactSuccess(message);
  },
});
