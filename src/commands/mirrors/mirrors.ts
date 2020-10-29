import { botCache } from "../../../cache.ts";
import { sendMessage } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";
import { db } from "../../database/database.ts";

botCache.commands.set("mirrors", {
  name: "mirrors",
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      literals: ["create", "delete", "edit"],
      required: false,
    },
  ],
  permissionLevels: [PermissionLevels.ADMIN],
  execute: async (message) => {
    const mirrors = await db.mirrors.findMany(
      (value) =>
        value.sourceGuildID === message.guildID ||
        value.mirrorGuildID === message.guildID,
      true,
    );
    if (!mirrors?.length) {
      return botCache.helpers.reactError(message);
    }

    sendMessage(
      message.channelID,
      mirrors.map((mirror) =>
        `<#${mirror.sourceChannelID}> => <#${mirror.mirrorChannelID}>`
      ).join("\n"),
    );
  },
});
