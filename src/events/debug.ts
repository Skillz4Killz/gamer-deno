import { sendMessage } from "../../deps.ts";
import { configs } from "../../configs.ts";
import { botCache } from "../../deps.ts";
import { Embed } from "../utils/Embed.ts";

botCache.eventHandlers.debug = async function (data) {
  console.error(data);

  switch (data.type) {
    case "error":
    case "wsClose":
    case "wsError":
      if (configs.channelIDs.errorChannelID) {
        const embed = new Embed()
          .setColor("RANDOM")
          .setDescription([
            "```json",
            data,
            "```",
          ].join("\n"));

        await sendMessage(
          configs.channelIDs.errorChannelID,
          { embed },
        );
      }
    default:
      return;
  }
};
