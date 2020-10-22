// import type {Channel } from "../../../../deps.ts";
// import type {botCache } from "../../../../mod.ts";
// import type {PermissionLevels } from "../../../types/commands.ts";
// import type {createSubcommand } from "../../../utils/helpers.ts";

// createSubcommand("settings-mails", {
//   name: "logs",
//   permissionLevels: [PermissionLevels.ADMIN],
//   guildOnly: true,
//   arguments: [{ name: "channel", type: "guildtextchannel", required: false }],
//   execute: (message, args: SettingsMailsChannelArgs) => {
//     db.guilds.update(message.guildID, {
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
