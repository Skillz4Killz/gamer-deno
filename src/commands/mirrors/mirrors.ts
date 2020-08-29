import { botCache } from "../../../mod.ts";
import { mirrorsDatabase } from "../../database/schemas/mirrors.ts";
import { sendMessage, addReaction } from "../../../deps.ts";

botCache.commands.set("mirrors", {
  name: "mirrors",
  arguments: [
    {
      name: "subcommand",
      type: "subcommand",
      literals: ["create", "delete"],
      required: false,
    },
  ],
  execute: async (message) => {
    const mirrors = await mirrorsDatabase.find(
      {
        $or: [
          { sourceGuildID: message.guildID },
          { mirrorGuildID: message.guildID },
        ],
      },
    );
    // @ts-ignore TODO: Fix with mongodb issue
    if (!mirrors?.length) {
      return addReaction(message.channelID, message.id, "❌");
    }

    sendMessage(
      message.channel,
      // @ts-ignore TODO: Fix with mongodb issue
      mirrors.map((mirror) =>
        `<#${mirror.sourceChannelID}> => <#${mirror.mirrorChannelID}>`
      ).join("\n"),
    );
  },
});
