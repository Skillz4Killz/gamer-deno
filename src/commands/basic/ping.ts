import { botCache } from "../../../mod.ts";
import { translate } from "../../utils/i18next.ts";
import {
  createCommandAliases,
  sendResponse,
} from "../../utils/helpers.ts";

botCache.commands.set(`ping`, {
  name: `ping`,
  execute: function (message) {
    const ping = Date.now() - message.timestamp;

    return sendResponse(
      message,
      translate(
        message.guildID,
        `commands/ping:TIME`,
        { time: ping / 1000 },
      ),
    );
  },
});

createCommandAliases("ping", ["pong"]);
