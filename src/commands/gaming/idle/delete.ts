import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { parsePrefix } from "../../../monitors/commandHandler.ts";
import {
  createSubcommand,
  sendEmbed,
  sendResponse,
} from "../../../utils/helpers.ts";
import { translate } from "../../../utils/i18next.ts";

createSubcommand("idle", {
  name: "delete",
  execute: async function (message) {
    await db.idle.delete(message.author.id);
    await botCache.helpers.reactSuccess(message);
  },
});
