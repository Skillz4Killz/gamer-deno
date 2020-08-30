// DEV PURPOSES ONLY
import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { guildsDatabase } from "../../database/schemas/guilds.ts";

botCache.commands.set(`ddb`, {
  name: `ddb`,
  permissionLevels: [PermissionLevels.BOT_OWNER],
  execute: async function (message) {
    // guildsDatabase.deleteMany({});
    console.log(botCache.eventHandlers.reactionAdd?.toString());
  },
});
