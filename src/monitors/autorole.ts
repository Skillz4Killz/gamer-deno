import { addRole, botCache, cache } from "../../deps.ts";
import { db } from "../database/database.ts";

botCache.monitors.set("autorole", {
  name: "autorole",
  botServerPermissions: ["MANAGE_ROLES"],
  execute: async function (message) {
    // If has roles then this monitor is useless.
    // This will also end up checking if they have the auto role already
    // The message type helps ignore other messages like discord default welcome messages
    if (
      message.type !== 0 || !message.member || message.member.roles.length
    ) {
      return;
    }

    // Get the verification category id so we dont assign the role while they are chatting in verification
    const settings = await db.guilds.get(message.guildID);
    // If the guild has default settings then they dont have verification or autorole enabled
    if (!settings) return;

    const channel = cache.channels.get(message.channelID);
    if (!channel?.parentID) return;
    if (channel.parentID === settings.verifyCategoryID) return;

    addRole(
      message.guildID,
      message.author.id,
      message.author.bot ? settings.botsAutoRoleID : settings.userAutoRoleID,
    );
  },
});
