import { translate } from "../../utils/i18next.ts";
import { createCommand, sendResponse } from "../../utils/helpers.ts";

createCommand({
  name: `ping`,
  aliases: ["pong"],
  execute: function (message) {
    sendResponse(
      message,
      translate(
        message.guildID,
        `commands/ping:TIME`,
        { time: (Date.now() - message.timestamp) / 1000 },
      ),
    );
  },
});
