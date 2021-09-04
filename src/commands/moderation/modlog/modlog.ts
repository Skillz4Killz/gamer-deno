import { botCache, cache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { createCommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createCommand({
  name: "modlog",
  aliases: ["ml"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["MANAGE_GUILD"],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "member", type: "member", required: false },
    { name: "userID", type: "snowflake", required: false },
  ] as const,
  guildOnly: true,
  execute: async function (message, args, guild) {
    if (!guild) return;

    const memberID = args.member?.id || args.userID;
    if (!memberID) return botCache.helpers.reactError(message);

    const logs = await db.modlogs.findMany({ userID: memberID, guildID: message.guildID }, true);
    if (!logs.length) return botCache.helpers.reactError(message);

    // Sort modlogs by oldest modlog as first in the array
    const sortedModLogs = logs.sort((a, b) => a.modlogID - b.modlogID);
    const modlogTypes = [
      {
        type: translate(message.guildID, "strings:MODLOG_BAN"),
        amount: logs.filter((log) => log.action === `ban`).length,
      },
      {
        type: translate(message.guildID, "strings:MODLOG_UNBAN"),
        amount: logs.filter((log) => log.action === `unban`).length,
      },
      {
        type: translate(message.guildID, "strings:MODLOG_MUTE"),
        amount: logs.filter((log) => log.action === `mute`).length,
      },
      {
        type: translate(message.guildID, "strings:MODLOG_UNMUTE"),
        amount: logs.filter((log) => log.action === `unmute`).length,
      },
      {
        type: translate(message.guildID, "strings:MODLOG_WARN"),
        amount: logs.filter((log) => log.action === `warn`).length,
      },
      {
        type: translate(message.guildID, "strings:MODLOG_KICK"),
        amount: logs.filter((log) => log.action === `kick`).length,
      },
      {
        type: translate(message.guildID, "strings:MODLOG_NOTE"),
        amount: logs.filter((log) => log.action === `note`).length,
      },
    ];

    const description = modlogTypes.map((log) =>
      translate(message.guildID, `strings:MODLOG_DETAILS`, {
        type: log.type,
        amount: log.amount,
      })
    );

    const embed = new Embed()
      .setAuthor(
        translate(message.guildID, "strings:MODLOG_USER_HISTORY", {
          user: args.member?.tag || translate(message.guildID, "strings:UNKNOWN_USER"),
        }),
        args.member ? args.member.avatarURL : undefined
      )
      .setDescription(description.join(`\n`));
    if (args.member) embed.setThumbnail(args.member.avatarURL);

    for (const log of sortedModLogs) {
      if (embed.fields.length === 25) {
        await message.send({ embed }).catch(console.log);
        embed.fields = [];
      }

      const date = new Date(log.timestamp);

      const readableDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

      const member = await botCache.helpers.fetchMember(message.guildID, log.modID).catch((error) => {
        console.log(error);
        return undefined;
      });

      const details = [
        translate(message.guildID, "strings:MODLOG_MODERATOR", {
          name: member?.tag || `Unknown (ID: ${log.modID})`,
        }),
        translate(message.guildID, "strings:MODLOG_TIME", {
          time: readableDate,
        }),
      ];
      if (log.duration) {
        details.push(
          translate(message.guildID, "strings:MODLOG_DURATION", {
            duration: log.duration,
          })
        );
      }

      details.push(translate(message.guildID, "strings:REASON", { reason: log.reason }));

      embed.addField(
        translate(message.guildID, "strings:MODLOG_CASE_INFO", {
          type: botCache.helpers.toTitleCase(log.action),
          id: log.modlogID,
        }),
        details.join("\n")
      );
    }

    return message.send({ embed });
  },
});
