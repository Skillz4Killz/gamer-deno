import { botCache, cache, memberIDHasPermission } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("surveys", {
  name: "create",
  aliases: ["c"],
  permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
  vipServerOnly: true,
  guildOnly: true,
  arguments: [
    { name: "name", type: "string" },
    { name: "dm", type: "string", literals: ["dm"], required: false },
    { name: "channel", type: "guildtextchannel", required: false },
    { name: "channelID", type: "snowflake", required: false },
  ] as const,
  execute: async function (message, args, guild) {
    if (!args.channel && !args.channelID) {
      return botCache.helpers.reactError(message);
    }

    let channelToUse = args.channel;
    if (!channelToUse && args.channelID) {
      const channel = cache.channels.get(args.channelID);
      if (!channel) return botCache.helpers.reactError(message);

      if (!(await memberIDHasPermission(message.author.id, message.guildID, ["ADMINISTRATOR"]))) {
        return botCache.helpers.reactError(message);
      }

      channelToUse = channel;
    }

    if (!channelToUse) return botCache.helpers.reactError(message);

    const exists = await db.surveys.get(`${message.guildID}-${args.name}`);
    if (exists) return botCache.helpers.reactError(message);

    await db.surveys.create(`${message.guildID}-${args.name}`, {
      name: args.name,
      questions: [],
      guildID: message.guildID,
      creatorID: message.author.id,
      channelID: channelToUse.id,
      allowedRoleIDs: [],
      useDM: Boolean(args.dm),
    });

    return message.reply(translate(message.guildID, "strings:SURVEYS_CREATED", { name: args.name }));
  },
});
