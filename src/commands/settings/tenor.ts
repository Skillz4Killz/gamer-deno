import { botCache } from "../../../mod.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createSubcommand } from "../../utils/helpers.ts";

createSubcommand("settings", {
  name: "tenor",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "enable", type: "boolean" },
  ],
  execute: async (message, args: SettingsTenorArgs) => {
    db.guilds.update(message.guildID, { tenorEnabled: args.enable });

    if (!args.enable) botCache.tenorDisabledGuildIDs.add(message.guildID);
    else botCache.tenorDisabledGuildIDs.delete(message.guildID);

    botCache.helpers.reactSuccess(message);
  },
});

interface SettingsTenorArgs {
  enable?: boolean;
}
