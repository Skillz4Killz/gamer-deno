import { botCache, Role } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("settings-mute", {
  name: "role",
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  vipServerOnly: true,
  arguments: [
    { name: "role", type: "role" },
  ],
  execute: function (message, args: SettingsMuteArgs) {
    db.guilds.update(message.guildID, { muteRoleID: args.role.id });
    return botCache.helpers.reactSuccess(message);
  },
});

interface SettingsMuteArgs {
  role: Role;
}
