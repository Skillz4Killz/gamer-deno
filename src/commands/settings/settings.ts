import { botCache } from "../../../mod.ts";
import type { PermissionLevels } from "../../types/commands.ts";

botCache.commands.set("settings", {
  name: "settings",
  aliases: ["s"],
  permissionLevels: [PermissionLevels.ADMIN],
  arguments: [
    { name: "subcommand", type: "subcommand" },
  ],
  execute: (message, args, guild) => {
  },
});
