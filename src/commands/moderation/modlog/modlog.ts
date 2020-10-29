import type { Member } from "../../../../deps.ts";

import { botCache } from "../../../../cache.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { Embed } from "../../../utils/Embed.ts";
import { translate } from "../../../utils/i18next.ts";
import { createCommand, sendEmbed } from "../../../utils/helpers.ts";
import { db } from "../../../database/database.ts";

createCommand({
  name: `modlog`,
  aliases: ["ml"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  botServerPermissions: ["MANAGE_GUILD"],
  arguments: [
    { name: "subcommand", type: "subcommand", required: false },
    { name: "member", type: "member", required: false },
    { name: "userID", type: "snowflake", required: false },
  ],
  guildOnly: true,
  execute: async function (message, args: ModlogArgs, guild) {
    if (!guild) return;

    const memberID = args.member?.id || args.userID;
    if (!memberID) return botCache.helpers.reactError(message);

    const logs = await db.modlogs.findMany(
      { userID: memberID, guildID: message.guildID },
      true,
    );
    if (!logs.length) return botCache.helpers.reactError(message);

    // Sort modlogs by latest modlog as first in the array
    const sortedModLogs = logs.sort((a, b) => b.modlogID - a.modlogID);
    const modlogTypes = [
      {
        type: translate(message.guildID, "commands/modlog:BAN"),
        amount: logs.filter((log) => log.action === `ban`).length,
      },
      {
        type: translate(message.guildID, "commands/modlog:UNBAN"),
        amount: logs.filter((log) => log.action === `unban`).length,
      },
      {
        type: translate(message.guildID, "commands/modlog:MUTE"),
        amount: logs.filter((log) => log.action === `mute`).length,
      },
      {
        type: translate(message.guildID, "commands/modlog:UNMUTE"),
        amount: logs.filter((log) => log.action === `unmute`).length,
      },
      {
        type: translate(message.guildID, "commands/modlog:WARN"),
        amount: logs.filter((log) => log.action === `warn`).length,
      },
      {
        type: translate(message.guildID, "commands/modlog:KICK"),
        amount: logs.filter((log) => log.action === `kick`).length,
      },
      {
        type: translate(message.guildID, "commands/modlog:NOTE"),
        amount: logs.filter((log) => log.action === `note`).length,
      },
    ];

    const description = modlogTypes.map((log) =>
      translate(
        message.guildID,
        `commands/modlog:DETAILS`,
        { type: log.type, amount: log.amount },
      )
    );

    const embed = new Embed()
      .setAuthor(
        translate(
          message.guildID,
          "commands/modlog:USER_HISTORY",
          {
            user: args.member?.tag ||
              translate(message.guildID, "common:UNKNOWN_USER"),
          },
        ),
        args.member ? args.member.avatarURL : undefined,
      )
      .setDescription(description.join(`\n`));
    if (args.member) embed.setThumbnail(args.member.avatarURL);

    for (const log of sortedModLogs) {
      if (embed.fields.length === 25) {
        await sendEmbed(message.channelID, embed);
        embed.fields = [];
      }

      const date = new Date(log.timestamp);

      const readableDate = `${date.getMonth() +
        1}/${date.getDate()}/${date.getFullYear()}`;

      const details = [
        translate(
          message.guildID,
          "commands/modlog:MODERATOR",
          { name: message.author.username },
        ),
        translate(
          message.guildID,
          "commands/modlog:TIME",
          { time: readableDate },
        ),
      ];
      if (log.duration) {
        details.push(
          translate(
            message.guildID,
            "comands/modlog:DURATION",
            { duration: log.duration },
          ),
        );
      }

      details.push(
        translate(
          message.guildID,
          "commands/modlog:REASON",
          { reason: log.reason },
        ),
      );

      embed.addField(
        translate(message.guildID, "commands/modlog:CASE_INFO", {
          type: botCache.helpers.toTitleCase(log.action),
          id: log.modlogID,
        }),
        details.join("\n"),
      );
    }

    return sendEmbed(message.channelID, embed);
  },
});

interface ModlogArgs {
  member?: Member;
  userID?: string;
}
