import { translate } from "../../utils/i18next.ts";
import { createCommand, sendResponse } from "../../utils/helpers.ts";

createCommand({
  name: `ping`,
  aliases: ["pong"],
  botChannelPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES"],
  execute: function (message) {
    sendResponse(
      message,
      translate(
        message.guildID,
        `strings:PING_TIME`,
        { time: (Date.now() - message.timestamp) / 1000 },
      ),
    );
  },
});
