import { botCache } from "../../../deps.ts";
import { db } from "../../database/database.ts";
import { createSubcommand } from "../../utils/helpers.ts";

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
  ] as const,
  vipServerOnly: true,
  execute: async (message, args) => {
    if (message.channelID === args.channel.id) {
      return botCache.helpers.reactError(message);
    }

    const mirrors = botCache.mirrors.get(message.channelID);
    if (!mirrors) {
      return botCache.helpers.reactError(message);
    }

    const relevantMirrors = mirrors.filter((mirror) => mirror.mirrorChannelID === args.channel!.id);

    relevantMirrors.forEach(async (mirror) => {
      switch (args.type) {
        case "delete":
          mirror.deleteSourceMessages = args.enabled;
          await db.mirrors.updateOne(
            {
              sourceChannelID: message.channelID,
              mirrorChannelID: args.channel.id,
            },
            { deleteSourceMessages: args.enabled }
          );
          break;
        case "anonymous":
          mirror.anonymous = args.enabled;
          await db.mirrors.updateOne(
            {
              sourceChannelID: message.channelID,
              mirrorChannelID: args.channel.id,
            },
            { anonymous: args.enabled }
          );
          break;
        case "images":
          mirror.filterImages = args.enabled;
          await db.mirrors.updateOne(
            {
              sourceChannelID: message.channelID,
              mirrorChannelID: args.channel.id,
            },
            { filterImages: args.enabled }
          );
          break;
      }
    });

    return botCache.helpers.reactSuccess(message);
  },
});
