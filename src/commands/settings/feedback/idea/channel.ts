import { Channel } from "../../../../../deps.ts";
import { botCache } from "../../../../../cache.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-feedback-idea", {
  name: "channel",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
  ],
  execute: async (message, args: IdeasChannelArgs) => {
    db.guilds.update(message.guildID, { ideaChannelID: args.channel?.id });
    botCache.helpers.reactSuccess(message);
  },
});

interface IdeasChannelArgs {
  channel?: Channel;
}
