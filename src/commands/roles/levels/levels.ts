import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("roles", {
  name: "levels",
  aliases: ["lvl"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
});
