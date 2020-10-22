import { Channel } from "../../../../../deps.ts";
import { botCache } from "../../../../../mod.ts";
import { db } from "../../../../database/database.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-feedback-bugs", {
  name: "channel",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "channel", type: "guildtextchannel", required: false },
  ],
  execute: async (message, args: BugsChannelArgs) => {
    db.guilds.update(message.guildID, { bugsChannelID: args.channel?.id });
    botCache.helpers.reactSuccess(message);
  },
});

interface BugsChannelArgs {
  channel?: Channel;
}
