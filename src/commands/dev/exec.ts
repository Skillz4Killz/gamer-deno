import { botCache } from "../../../mod.ts";
import type { PermissionLevels } from "../../types/commands.ts";

botCache.commands.set(`exec`, {
  name: `exec`,
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
