import type { Channel } from "../../../deps.ts";

import { addReaction } from "../../../deps.ts";
import { createSubcommand } from "../../utils/helpers.ts";
import { botCache } from "../../../cache.ts";
import { db } from "../../database/database.ts";

createSubcommand("mirrors", {
  name: "edit",
  arguments: [
    { name: "channel", type: "guildtextchannel" },
    {
      name: "type",
      type: "string",
      literals: ["delete", "anonymous", "images"],
    },
    { name: "enabled", type: "boolean", defaultValue: true },
  ],
  vipServerOnly: true,
  execute: async (message, args: MirrorEditArgs) => {
    if (message.channelID === args.channel.id) {
      return addReaction(
        message.channelID,
        message.id,
        "❌",
      );
    }

    const mirrors = botCache.mirrors.get(message.channelID);
    if (!mirrors) {
      return addReaction(
        message.channelID,
        message.id,
        "❌",
      );
    }

    const relevantMirrors = mirrors.filter((mirror) =>
      mirror.mirrorChannelID === args.channel!.id
    );

    relevantMirrors.forEach((mirror) => {
      switch (args.type) {
        case "delete":
          mirror.deleteSourceMessages = args.enabled;
          db.mirrors.updateOne(
            {
              sourceChannelID: message.channelID,
              mirrorChannelID: args.channel.id,
            },
            { deleteSourceMessages: args.enabled },
          );
          break;
        case "anonymous":
          mirror.anonymous = args.enabled;
          db.mirrors.updateOne(
            {
              sourceChannelID: message.channelID,
              mirrorChannelID: args.channel.id,
            },
            { anonymous: args.enabled },
          );
          break;
        case "images":
          mirror.filterImages = args.enabled;
          db.mirrors.updateOne(
            {
              sourceChannelID: message.channelID,
              mirrorChannelID: args.channel.id,
            },
            { filterImages: args.enabled },
          );
          break;
      }
    });

    return botCache.helpers.reactSuccess(message);
  },
});

interface MirrorEditArgs {
  channel: Channel;
  type: "delete" | "anonymous" | "images";
  enabled: boolean;
}
