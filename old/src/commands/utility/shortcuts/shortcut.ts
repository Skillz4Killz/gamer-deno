import { PermissionLevels } from "../../../types/commands.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "shortcut",
  aliases: ["shortcuts", "sc"],
  permissionLevels: [PermissionLevels.ADMIN, PermissionLevels.MODERATOR],
  vipServerOnly: true,
  arguments: [{ name: "subcommand", type: "subcommand" }],
  execute: async function () {},
});
