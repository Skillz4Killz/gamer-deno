import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-tags", {
  name: "channel",
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    {
      name: "channel",
      type: "guildtextchannel",
    },
  ] as const,
  execute: async function (message, args) {
    const settings = await db.guilds.get(message.guildID);

    let disabledTagChannelIDs = settings?.disabledTagChannelIDs || [];
    if (disabledTagChannelIDs.includes(args.channel.id)) {
      disabledTagChannelIDs = disabledTagChannelIDs.filter((id) => id !== args.channel.id);
    } else disabledTagChannelIDs.push(args.channel.id);

    await db.guilds.update(message.guildID, { disabledTagChannelIDs });

    return botCache.helpers.reactSuccess(message);
  },
});
