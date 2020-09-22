import type { createSubcommand } from "../../utils/helpers.ts";
import type { Channel, addReaction } from "../../../deps.ts";
import { botCache } from "../../../mod.ts";
import type { mirrorsDatabase } from "../../database/schemas/mirrors.ts";

createSubcommand("mirrors", {
  name: "delete",
  arguments: [
    { name: "channel", type: "guildtextchannel" },
  ],
  execute: async (message, args: MirrorDeleteArgs) => {
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
      mirrorsDatabase.deleteMany({ sourceChannelID: message.channelID });
    } else {
      const otherMirrors = mirrors.filter((mirror) =>
        mirror.mirrorChannelID !== args.channel.id
      );
      if (!otherMirrors.length) {
        botCache.mirrors.delete(message.channelID);
        mirrorsDatabase.deleteMany({ sourceChannelID: message.channelID });
      } else {
        botCache.mirrors.set(message.channelID, otherMirrors);
        mirrorsDatabase.deleteMany(
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

interface MirrorDeleteArgs {
  channel: Channel;
}
