import { botCache } from "../../../mod.ts";
import { mirrorsDatabase } from "../../database/schemas/mirrors.ts";
import { sendMessage, addReaction } from "../../../deps.ts";
import { PermissionLevels } from "../../types/commands.ts";

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
    const mirrors = await mirrorsDatabase.find(
      {
        $or: [
          { sourceGuildID: message.guildID },
          { mirrorGuildID: message.guildID },
        ],
      },
    );
    if (!mirrors?.length) {
      return botCache.helpers.reactError(message);
    }

    sendMessage(
      message.channel,
      mirrors.map((mirror) =>
        `<#${mirror.sourceChannelID}> => <#${mirror.mirrorChannelID}>`
      ).join("\n"),
    );
  },
});
