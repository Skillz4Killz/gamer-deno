import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";

botCache.commands.set(`reload`, {
  name: `reload`,
  permissionLevels: [PermissionLevels.BOT_OWNER],
  arguments: [
    {
      name: "content",
      type: "...string",
    },
  ],
  execute: async function (message, args) {
    Deno.run({ cmd: args.content.split(" ") });
  },
});
