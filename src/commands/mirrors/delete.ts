import type { Channel } from "../../../deps.ts";

import { addReaction } from "../../../deps.ts";
import { createSubcommand } from "../../utils/helpers.ts";
import { botCache } from "../../../deps.ts";
import { db } from "../../database/database.ts";

createSubcommand("mirrors", {
  name: "delete",
  arguments: [
    { name: "channel", type: "guildtextchannel" },
  ] as const,
  execute: async (message, args) => {
    const mirrors = botCache.mirrors.get(message.channelID);
    if (!mirrors) {
      return addReaction(
        message.channelID,
        message.id,
        "❌",
      );
    }

    if (mirrors.length === 1) {
      botCache.mirrors.delete(message.channelID);
      await db.mirrors.deleteMany({ sourceChannelID: message.channelID });
    } else {
      const otherMirrors = mirrors.filter((mirror) =>
        mirror.mirrorChannelID !== args.channel.id
      );
      if (!otherMirrors.length) {
        botCache.mirrors.delete(message.channelID);
        await db.mirrors.deleteMany({ sourceChannelID: message.channelID });
      } else {
        botCache.mirrors.set(message.channelID, otherMirrors);
        await db.mirrors.deleteMany(
          {
            sourceChannelID: message.channelID,
            mirrorChannelID: args.channel.id,
          },
        );
      }
    }

    return botCache.helpers.reactSuccess(message);
  },
});
