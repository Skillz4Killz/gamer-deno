import { botCache } from "../../mod.ts";
import type { PermissionLevels } from "../types/commands.ts";
import type { configs } from "../../configs.ts";

// The member using the command must be one of the bots dev team
botCache.permissionLevels.set(
  PermissionLevels.BOT_DEVS,
  async (message) => configs.userIDs.botDevs.includes(message.author.id),
);
