import { botCache } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `update`,
  permissionLevels: [PermissionLevels.BOT_OWNER],
  arguments: [
    {
      name: "type",
      type: "string",
    },
  ],
  execute: async function (message, args, guild) {
    switch (args.type) {
      case "reload":
        await Deno.run({ cmd: "git pull".split(" ") }).status();
        return botCache.commands.get("reload")?.execute?.(message, {}, guild);
      default:
        await Deno.run({ cmd: "git pull".split(" ") }).status();
        return Deno.run({ cmd: "pm2 restart gamer".split(" ") });
    }
  },
});
