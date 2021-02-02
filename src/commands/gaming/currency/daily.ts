import { botCache } from "../../../../deps.ts";
import { createCommand } from "../../../utils/helpers.ts";

// TODO: add functionality
createCommand({
  name: "daily",
  execute: async function (message) {
    return botCache.helpers.reactError(message);
  },
});
