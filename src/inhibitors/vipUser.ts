import { botCache } from "../../cache.ts";
import { sendResponse } from "../utils/helpers.ts";
import { translate } from "../utils/i18next.ts";

botCache.inhibitors.set("vipUser", async function (message, command) {
  if (!command.vipUserOnly) return false;

  // If this is a vip server allow the command
  if (botCache.vipUserIDs.has(message.author.id)) return false;

  sendResponse(message, translate(message.guildID, "strings:NEED_VIP"));
  return true;
});
