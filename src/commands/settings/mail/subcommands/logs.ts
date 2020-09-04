// import { Channel } from "../../../../deps.ts";
// import { botCache } from "../../../../mod.ts";
// import { PermissionLevels } from "../../../types/commands.ts";
// import { createSubcommand } from "../../../utils/helpers.ts";
// import { guildsDatabase } from "../../../database/schemas/guilds.ts";

// createSubcommand("settings-mails", {
//   name: "logs",
//   permissionLevels: [PermissionLevels.ADMIN],
//   guildOnly: true,
//   arguments: [{ name: "channel", type: "guildtextchannel", required: false }],
//   execute: (message, args: SettingsMailsChannelArgs) => {
//     guildsDatabase.updateOne({ guildID: message.guildID }, {
//       $set: { mailsSupportChannelID: args.channel?.id },
//     });

//     // Support channels are also cached
//     if (args.channel) {
//       botCache.guildSupportChannelIDs.set(message.guildID, args.channel.id);
//     } else {
//       botCache.guildSupportChannelIDs.delete(message.guildID);
//     }

//     botCache.helpers.reactSuccess(message);
//   },
// });

// interface SettingsMailsChannelArgs {
//   channel?: Channel;
// }
