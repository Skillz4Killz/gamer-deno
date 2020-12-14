import { sendMessage } from "../../deps.ts";
import { configs } from "../../configs.ts";
import { botCache } from "../../cache.ts";

botCache.eventHandlers.debug = function (data) {
  if (data.type === "error") {
    sendMessage(configs.channelIDs.errorChannelID, JSON.stringify(data));
    console.error(data);
  }
  // console.warn(data);
};
