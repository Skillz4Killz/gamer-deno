import { sendMessage } from "../../deps.ts";
import { configs } from "../../configs.ts";
import { botCache } from "../../deps.ts";

botCache.eventHandlers.debug = async function (data) {
  if (data.type === "error") {
    if (configs.channelIDs.errorChannelID) {
      await sendMessage(
        configs.channelIDs.errorChannelID,
        JSON.stringify(data),
      );
    }
    console.error(data);
  }
  // console.log(data);
};
