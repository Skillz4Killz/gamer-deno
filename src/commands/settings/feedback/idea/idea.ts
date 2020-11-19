import { PermissionLevels } from "../../../../types/commands.ts";
import { createSubcommand } from "../../../../utils/helpers.ts";

createSubcommand("settings-feedback", {
  name: "idea",
  aliases: ["ideas"],
  permissionLevels: [PermissionLevels.ADMIN],
  guildOnly: true,
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
  execute: async (message, args, guild) => {
  },
});
