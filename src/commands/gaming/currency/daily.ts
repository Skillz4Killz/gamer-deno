import { botCache } from "../../../../deps.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "daily",
  execute: function (message) {
    botCache.helpers.reactError(message);
  },
});
