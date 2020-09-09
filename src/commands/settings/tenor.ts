import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand, sendResponse } from "../../utils/helpers.ts";
import { guildsDatabase } from "../../database/schemas/guilds.ts";

createSubcommand("settings", {
  name: "tenor",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "enable", type: "boolean" },
  ],
  execute: async (message, args: SettingsTenorArgs) => {
    guildsDatabase.updateOne(
      { guildID: message.guildID },
      { $set: { tenorEnabled: args.enable } },
    );

    if (!args.enable) botCache.tenorDisabledGuildIDs.add(message.guildID);
    else botCache.tenorDisabledGuildIDs.delete(message.guildID);

    botCache.helpers.reactSuccess(message);
  },
});

interface SettingsTenorArgs {
  enable?: boolean;
}
