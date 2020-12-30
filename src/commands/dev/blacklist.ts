import { botCache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "blacklist",
  aliases: ["bl"],
  permissionLevels: [
    PermissionLevels.BOT_DEVS,
    PermissionLevels.BOT_OWNER,
    PermissionLevels.BOT_SUPPORT,
  ],
  botChannelPermissions: [
    "VIEW_CHANNEL",
    "ADD_REACTIONS",
    "READ_MESSAGE_HISTORY",
    "USE_EXTERNAL_EMOJIS",
  ],
  arguments: [
    { name: "type", type: "string", literals: ["add", "remove"] },
    { name: "userOrGuild", type: "string", literals: ["user", "guild"] },
    { name: "id", type: "snowflake" },
  ] as const,
  execute: async function (message, args) {
    if (args.type === "add") {
      db.blacklisted.update(
        args.id,
        { type: args.userOrGuild as "user" | "guild" },
      );
    } else db.blacklisted.delete(args.id);

    await botCache.helpers.reactSuccess(message);
  },
});
