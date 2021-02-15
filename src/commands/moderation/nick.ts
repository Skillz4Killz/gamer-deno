import { botCache, botID, editMember, higherRolePosition, highestRole } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "nick",
  aliases: ["nickname"],
  botServerPermissions: ["CHANGE_NICKNAME"],
  arguments: [
    { name: "member", type: "member", required: false },
    { name: "userID", type: "snowflake", required: false },
    { name: "nick", type: "...string" },
  ] as const,
  guildOnly: true,
  execute: async function (message, args, guild) {
    if (!guild) return;

    // IF A MEMBER IS PROVIDED MUST BE MOD/ADMIN
    if (args.member || args.userID) {
      const settings = await db.guilds.get(message.guildID);
      if (!botCache.helpers.isModOrAdmin(message, settings)) {
        return botCache.helpers.reactError(message);
      }
    } // IF NEITHER WAS PROVIDED, EDITING SELF
    else {
      args.member = message.member;
    }

    if (args.member) {
      if (args.member.id === guild.ownerID) {
        return botCache.helpers.reactError(message);
      }

      const botsHighestRole = await highestRole(message.guildID, botID);
      const membersHighestRole = await highestRole(message.guildID, args.member.id);

      if (
        !botsHighestRole ||
        !membersHighestRole ||
        !(await higherRolePosition(message.guildID, botsHighestRole.id, membersHighestRole.id))
      ) {
        return botCache.helpers.reactError(message);
      }

      // IF NOT EDITING SELF MAKE SURE USER IS HIGHER
      if (message.author.id !== args.member.id) {
        const modsHighestRole = await highestRole(message.guildID, message.author.id);
        if (
          !modsHighestRole ||
          !membersHighestRole ||
          !(await higherRolePosition(message.guildID, modsHighestRole.id, membersHighestRole.id))
        ) {
          return botCache.helpers.reactError(message);
        }
      }
    } else if (!args.userID) return botCache.helpers.reactError(message);

    const userID = args.member?.id || args.userID!;
    if (userID === guild.ownerID) return botCache.helpers.reactError(message);

    await editMember(message.guildID, userID, { nick: args.nick })
      .then(async () => await botCache.helpers.reactSuccess(message))
      .catch((error) => {
        console.log(error);
        botCache.helpers.reactError(message);
      });
  },
});
