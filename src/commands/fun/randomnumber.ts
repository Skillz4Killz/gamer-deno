import { botCache } from "../../../deps.ts";
import { createCommand, sendResponse } from "../../utils/helpers.ts";

createCommand({
  name: "randomnumber",
  aliases: ["rn"],
  arguments: [
    { name: "min", type: "number", defaultValue: 0 },
    { name: "max", type: "number", defaultValue: 100 },
  ],
  vipServerOnly: true,
  execute: function (message, args: CommandArgs) {
    sendResponse(
      message,
      botCache.helpers.cleanNumber(
        Math.floor(Math.random() * (args.max - args.min) + args.min),
      ),
    );
  },
});

interface CommandArgs {
  min: number;
  max: number;
}
