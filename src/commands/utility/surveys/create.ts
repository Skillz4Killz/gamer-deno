import type { Channel } from "../../../../deps.ts";

import { cache, memberIDHasPermission } from "../../../../deps.ts";
import { createSubcommand, sendResponse } from "../../../utils/helpers.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { botCache } from "../../../../cache.ts";
import { translate } from "../../../utils/i18next.ts";
import { db } from "../../../database/database.ts";

createSubcommand("surveys", {
  name: "create",
  aliases: ["c"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  // vipServerOnly: true,
  guildOnly: true,
  arguments: [
    { name: "name", type: "string" },
    { name: "dm", type: "string", literals: ["dm"], required: false },
    { name: "channel", type: "guildtextchannel", required: false },
    { name: "channelID", type: "snowflake", required: false },
  ],
  execute: async function (message, args: SurveysCreateArgs, guild) {
    if (!args.channel && !args.channelID) {
      return botCache.helpers.reactError(message);
    }

    let channelToUse = args.channel;
    if (!channelToUse && args.channelID) {
      const channel = cache.channels.get(args.channelID);
      if (!channel) return botCache.helpers.reactError(message);

      if (
        !memberIDHasPermission(
          message.author.id,
          message.guildID,
          ["ADMINISTRATOR"],
        )
      ) {
        return botCache.helpers.reactError(message);
      }

      channelToUse = channel;
    }

    if (!channelToUse) return botCache.helpers.reactError(message);

    const exists = await db.surveys.findOne(
      { guildID: message.guildID, name: args.name },
    );
    if (exists) return botCache.helpers.reactError(message);

    const member = cache.members.get(message.author.id);
    if (!member) return botCache.helpers.reactError(message);

    // undefined id to have it create a random id number
    db.surveys.create(message.id, {
      name: args.name,
      questions: [],
      guildID: message.guildID,
      creatorID: message.author.id,
      channelID: channelToUse.id,
      allowedRoleIDs: [],
      useDM: Boolean(args.dm),
    });

    return sendResponse(
      message,
      translate(
        message.guildID,
        "commands/surveys:CREATED",
        { name: args.name },
      ),
    );
  },
});

interface SurveysCreateArgs {
  name: string;
  dm?: string;
  channel?: Channel;
  channelID?: string;
}
