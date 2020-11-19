import {
  addRole,
  botCache,
  botID,
  cache,
  higherRolePosition,
  highestRole,
  removeRole,
  sendMessage,
} from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { createCommand } from "../../utils/helpers.ts";
import { translate } from "../../utils/i18next.ts";

createCommand({
  name: `roles`,
  aliases: ["role"],
  guildOnly: true,
  botServerPermissions: ["MANAGE_ROLES"],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "role", type: "role", required: false },
  ],
  execute: async (message, args, guild) => {
    const settings = await db.guilds.get(message.guildID);
    const member = cache.members.get(message.author.id);
    // If there are no settings then there are no public roles
    if (!settings?.publicRoleIDs.length || !member) {
      return botCache.helpers.reactError(message);
    }

    // No args were provided so we just list the public roles
    if (!args.role) {
      return sendMessage(
        message.channelID,
        {
          content: [
            `<@!${member.id}>`,
            "",
            settings.publicRoleIDs.map((id) => `<@&${id}>`).join(" "),
          ].join("\n"),
          mentions: { users: [message.author.id] },
        },
      );
    }

    if (!settings.publicRoleIDs.includes(args.role.id)) {
      return botCache.helpers.reactError(message);
    }

    // Check if the bots role is high enough to manage the role
    const botsHighestRole = await highestRole(message.guildID, botID);
    if (!botsHighestRole) return botCache.helpers.reactError(message);

    if (
      !higherRolePosition(message.guildID, botsHighestRole.id, args.role.id)
    ) {
      return botCache.helpers.reactError(message);
    }

    // Check if the authors role is high enough to grant this role
    const hasRole = member.guilds.get(message.guildID)?.roles.includes(
      args.role.id,
    );
    // Give/tag the role to the user as all checks have passed
    if (hasRole) {
      removeRole(
        message.guildID,
        message.author.id,
        args.role.id,
        translate(message.guildID, "commands/roles:SELF_REMOVE"),
      );
    } else {
      addRole(
        message.guildID,
        message.author.id,
        args.role.id,
        translate(message.guildID, "commands/roles:SELF_ASSIGN"),
      );
    }

    // TODO: missions
    // Gamer.helpers.levels.completeMission(member, `role`, message.guildID)
    botCache.helpers.reactSuccess(message);
  },
});
