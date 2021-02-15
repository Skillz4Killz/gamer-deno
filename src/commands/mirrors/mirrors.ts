import { botCache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { createCommand } from "../../utils/helpers.ts";

createCommand({
  name: "mirrors",
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      required: false,
    },
  ] as const,
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async (message) => {
    const mirrors = await db.mirrors.findMany(
      (value) => value.sourceGuildID === message.guildID || value.mirrorGuildID === message.guildID,
      true
    );
    if (!mirrors?.length) {
      return botCache.helpers.reactError(message);
    }

    return message.send(
      mirrors.map((mirror) => `<#${mirror.sourceChannelID}> => <#${mirror.mirrorChannelID}>`).join("\n")
    );
  },
});
