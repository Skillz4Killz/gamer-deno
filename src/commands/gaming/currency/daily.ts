import { botCache } from "../../../../deps.ts";
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "daily",
  execute: async function (message) {
    await botCache.helpers.reactError(message);
  },
});
