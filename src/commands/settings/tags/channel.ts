import { botCache, Channel } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-tags", {
  name: "channel",
  guildOnly: true,
  vipServerOnly: true,
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [{
    name: "channel",
    type: "guildtextchannel",
  }],
  execute: async function (message, args: SettingsTagsChannelArgs) {
    const settings = await db.guilds.get(message.guildID);

    let disabledTagChannelIDs = settings?.disabledTagChannelIDs || [];
    if (disabledTagChannelIDs.includes(args.channel.id)) {
      disabledTagChannelIDs = disabledTagChannelIDs.filter((id) =>
        id !== args.channel.id
      );
    } else disabledTagChannelIDs.push(args.channel.id);

    db.guilds.update(message.guildID, { disabledTagChannelIDs });
    botCache.helpers.reactSuccess(message);
  },
});

interface SettingsTagsChannelArgs {
  channel: Channel;
}
