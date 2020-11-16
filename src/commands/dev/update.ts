import { botCache } from "../../../cache.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: `update`,
  permissionLevels: [PermissionLevels.BOT_OWNER],
  arguments: [
    {
      name: "content",
      type: "...string",
    },
  ],
  execute: async function (message, args, guild) {
    switch (args.type) {
      case "reload":
        await Deno.run({ cmd: "git pull".split(" ") }).status();
        return botCache.commands.get("reload")?.execute?.(message, {}, guild);
      case "npm":
        return Deno.run(
          {
            cmd: "git pull && npm i && npm run build && pm2 restart gamer"
              .split(" "),
          },
        );
      default:
        return Deno.run(
          { cmd: "git pull && npm run build && pm2 restart gamer".split(" ") },
        );
    }
  },
});
