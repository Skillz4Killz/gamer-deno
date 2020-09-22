import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "settings",
  aliases: ["s"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
  execute: (message, args, guild) => {
  },
});
