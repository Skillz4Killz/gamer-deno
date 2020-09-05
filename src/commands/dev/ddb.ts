// DEV PURPOSES ONLY
import { botCache } from "../../../mod.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { modlogsDatabase } from "../../database/schemas/modlogs.ts";

botCache.commands.set(`ddb`, {
  name: `ddb`,
  permissionLevels: [PermissionLevels.BOT_OWNER],
  execute: async function (message) {
    // guildsDatabase.deleteMany({});
    modlogsDatabase.deleteMany({});
  },
});
