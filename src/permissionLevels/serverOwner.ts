import { botCache } from "../../mod.ts";
import type { PermissionLevels } from "../types/commands.ts";

// The member using the command must be an server owner.
botCache.permissionLevels.set(
  PermissionLevels.SERVER_OWNER,
  async (message) => message.guild()?.ownerID === message.author.id,
);
