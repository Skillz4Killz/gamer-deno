import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-mails", {
  name: "supportchannel",
  aliases: ["mailchannel", "sc", "mc"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    {
      name: "remove",
      type: "string",
      literals: ["remove", "off"],
      required: false,
    },
    { name: "channel", type: "guildtextchannel", required: false },
  ] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);
    if (!settings || !settings.mailsEnabled) return botCache.helpers.reactError(message);

    db.guilds.update(message.guildID, {
      mailsSupportChannelID: args.remove ? "" : args.channel?.id ?? message.channelID,
    });

    args.remove
      ? botCache.guildSupportChannelIDs.delete(args.channel?.id ?? message.channelID)
      : botCache.guildSupportChannelIDs.add(args.channel?.id ?? message.channelID);

    return botCache.helpers.reactSuccess(message);
  },
});
